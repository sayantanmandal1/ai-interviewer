from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from models import QueryRequest, DomainRequest, AnswerSubmission
from qa_engine import QAGenerator
from llama_index_helper import load_index
import openai
import os
from dotenv import load_dotenv
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
from pydantic import BaseModel, EmailStr
import logging

SESSIONS = {}
load_dotenv()
openai.api_key = os.getenv("OPENAI_API_KEY")

app = FastAPI()
qa = QAGenerator()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/query")
async def query_index(data: QueryRequest):
    index = load_index(data.lang)
    query_engine = index.as_query_engine()
    try:
        result = query_engine.query(data.question)
        return {"answer": result.response}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Query failed: {e}")

@app.post("/start")
async def start_interview(request: DomainRequest):
    output = qa.generate_questions(request.domain, request.level)
    return {"questions": output["questions"], "session_id": output["session_id"]}


@app.post("/evaluate")
async def evaluate_answers(request: AnswerSubmission):
    print("Received session_id:", request.session_id)
    print("Received answers:", request.answers)

    try:
        result = qa.evaluate_answers(request.session_id, request.answers)
        return result
    except Exception as e:
        import traceback
        traceback.print_exc()
        raise HTTPException(status_code=400, detail=f"Evaluation failed: {e}")
    

@app.get("/final_result")
async def final_result(easy_id: str, medium_id: str = None, hard_id: str = None):
    try:
        easy_score = SESSIONS[easy_id]["score"]
        medium_score = SESSIONS[medium_id]["score"] if medium_id else 0
        hard_score = SESSIONS[hard_id]["score"] if hard_id else 0

        passed = (
            (easy_score >= 80) or 
            (medium_score >= 60) or 
            (hard_score >= 40)
        )

        return {
            "passed": passed,
            "easy_score": easy_score,
            "medium_score": medium_score,
            "hard_score": hard_score,
            "final_result": "Passed" if passed else "Failed"
        }

    except KeyError as e:
        raise HTTPException(status_code=400, detail=f"Session ID missing or invalid: {e}")

# Add these imports at the top of your main.py


# Email configuration
SMTP_SERVER = os.getenv("SMTP_SERVER", "smtp.gmail.com")
SMTP_PORT = int(os.getenv("SMTP_PORT", 587))
EMAIL_ADDRESS = os.getenv("EMAIL_ADDRESS")
EMAIL_PASSWORD = os.getenv("EMAIL_PASSWORD")

# Pydantic models for email
class EmailRequest(BaseModel):
    to: EmailStr
    subject: str
    html: str
    cc: list[EmailStr] = []
    bcc: list[EmailStr] = []

class EmailResponse(BaseModel):
    success: bool
    message: str
    message_id: str = None

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Email sending function
def send_email_smtp(to_email: str, subject: str, html_content: str, cc: list = None, bcc: list = None):
    """
    Send email using SMTP with HTML content
    """
    try:
        # Validate environment variables
        if not EMAIL_ADDRESS or not EMAIL_PASSWORD:
            raise ValueError("Email credentials not found in environment variables")
        
        # Create message
        msg = MIMEMultipart('alternative')
        msg['From'] = EMAIL_ADDRESS
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add CC and BCC if provided
        if cc:
            msg['Cc'] = ', '.join(cc)
        if bcc:
            msg['Bcc'] = ', '.join(bcc)
        
        # Create HTML part
        html_part = MIMEText(html_content, 'html', 'utf-8')
        msg.attach(html_part)
        
        # Create SMTP session
        server = smtplib.SMTP(SMTP_SERVER, SMTP_PORT)
        server.starttls()  # Enable TLS encryption
        server.login(EMAIL_ADDRESS, EMAIL_PASSWORD)
        
        # Send email
        recipients = [to_email]
        if cc:
            recipients.extend(cc)
        if bcc:
            recipients.extend(bcc)
            
        text = msg.as_string()
        result = server.sendmail(EMAIL_ADDRESS, recipients, text)
        server.quit()
        
        logger.info(f"Email sent successfully to {to_email}")
        return {"success": True, "message": "Email sent successfully", "result": result}
        
    except smtplib.SMTPAuthenticationError as e:
        logger.error(f"SMTP Authentication Error: {str(e)}")
        raise HTTPException(status_code=401, detail="Email authentication failed. Check your credentials.")
    
    except smtplib.SMTPRecipientsRefused as e:
        logger.error(f"SMTP Recipients Refused: {str(e)}")
        raise HTTPException(status_code=400, detail="Invalid recipient email address.")
    
    except smtplib.SMTPServerDisconnected as e:
        logger.error(f"SMTP Server Disconnected: {str(e)}")
        raise HTTPException(status_code=503, detail="Email server unavailable. Please try again later.")
    
    except smtplib.SMTPException as e:
        logger.error(f"SMTP Error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to send email: {str(e)}")
    
    except Exception as e:
        logger.error(f"Unexpected error sending email: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Unexpected error: {str(e)}")

# API endpoint - add this to your FastAPI app
@app.post("/send-email", response_model=EmailResponse)
async def send_email_endpoint(email_request: EmailRequest):
    """
    Send email endpoint for interview evaluation reports
    """
    try:
        # Validate input
        if not email_request.to or not email_request.subject or not email_request.html:
            raise HTTPException(status_code=400, detail="Missing required email fields")
        
        # Send email
        result = send_email_smtp(
            to_email=email_request.to,
            subject=email_request.subject,
            html_content=email_request.html,
            cc=email_request.cc if email_request.cc else None,
            bcc=email_request.bcc if email_request.bcc else None
        )
        
        return EmailResponse(
            success=True,
            message="Email sent successfully",
            message_id=str(result.get("result", ""))
        )
        
    except HTTPException:
        # Re-raise HTTP exceptions
        raise
    
    except Exception as e:
        logger.error(f"Error in send_email_endpoint: {str(e)}")
        raise HTTPException(status_code=500, detail="Internal server error while sending email")

# Optional: Test email endpoint for debugging
@app.post("/test-email")
async def test_email():
    """
    Test email endpoint to verify SMTP configuration
    """
    try:
        test_html = """
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #667eea;">Test Email</h2>
            <p>This is a test email to verify SMTP configuration.</p>
            <p>If you receive this email, your SMTP setup is working correctly.</p>
            <hr>
            <p style="color: #666; font-size: 12px;">
                Sent from AI Interviewer System - Test
            </p>
        </div>
        """
        
        result = send_email_smtp(
            to_email=EMAIL_ADDRESS,  # Send test email to yourself
            subject="AI Interviewer - SMTP Test",
            html_content=test_html
        )
        
        return {"success": True, "message": "Test email sent successfully"}
        
    except Exception as e:
        logger.error(f"Test email failed: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Test email failed: {str(e)}")

# Optional: Email template for better formatting
def create_interview_report_template(evaluation_result, user_answers, domain, timestamp):
    """
    Create a professional HTML email template for interview reports
    """
    template = f"""
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Interview Evaluation Report</title>
        <style>
            body {{
                font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                line-height: 1.6;
                color: #333;
                max-width: 800px;
                margin: 0 auto;
                padding: 20px;
                background-color: #f5f5f5;
            }}
            .container {{
                background: white;
                border-radius: 10px;
                box-shadow: 0 4px 6px rgba(0,0,0,0.1);
                overflow: hidden;
            }}
            .header {{
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 30px;
                text-align: center;
            }}
            .header h1 {{
                margin: 0;
                font-size: 28px;
                font-weight: 300;
            }}
            .content {{
                padding: 30px;
            }}
            .info-grid {{
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
                gap: 20px;
                margin: 20px 0;
            }}
            .info-card {{
                background: #f8f9fa;
                padding: 20px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }}
            .info-card h3 {{
                margin: 0 0 10px 0;
                color: #667eea;
                font-size: 16px;
            }}
            .info-card p {{
                margin: 0;
                font-size: 18px;
                font-weight: 600;
            }}
            .question-block {{
                background: #f8f9fa;
                margin: 15px 0;
                padding: 20px;
                border-radius: 8px;
                border: 1px solid #e9ecef;
            }}
            .question-header {{
                font-weight: 600;
                color: #495057;
                margin-bottom: 10px;
            }}
            .answer {{
                background: white;
                padding: 15px;
                border-radius: 6px;
                margin: 10px 0;
                border-left: 3px solid #28a745;
            }}
            .metrics {{
                display: flex;
                justify-content: space-between;
                font-size: 12px;
                color: #6c757d;
                margin-top: 10px;
            }}
            .footer {{
                background: #f8f9fa;
                padding: 20px 30px;
                text-align: center;
                color: #6c757d;
                font-size: 14px;
            }}
            .status-badge {{
                display: inline-block;
                padding: 6px 12px;
                border-radius: 20px;
                font-size: 14px;
                font-weight: 600;
                text-transform: uppercase;
            }}
            .status-passed {{
                background: #d4edda;
                color: #155724;
            }}
            .status-failed {{
                background: #f8d7da;
                color: #721c24;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>🎯 Interview Evaluation Report</h1>
                <p>AI-Powered Technical Assessment</p>
            </div>
            
            <div class="content">
                <div class="info-grid">
                    <div class="info-card">
                        <h3>📚 Domain</h3>
                        <p>{domain}</p>
                    </div>
                    <div class="info-card">
                        <h3>📅 Date & Time</h3>
                        <p>{timestamp}</p>
                    </div>
                    <div class="info-card">
                        <h3>🎯 Final Score</h3>
                        <p>{evaluation_result.get('score', 0):.1f}/100</p>
                    </div>
                    <div class="info-card">
                        <h3>✅ Result</h3>
                        <p>
                            <span class="status-badge {'status-passed' if evaluation_result.get('result') == 'Passed' else 'status-failed'}">
                                {evaluation_result.get('result', 'Failed')}
                            </span>
                        </p>
                    </div>
                </div>
                
                <h2>📝 Detailed Responses</h2>
                <div class="questions-section">
                    {generate_questions_html(user_answers)}
                </div>
            </div>
            
            <div class="footer">
                <p>🤖 This report was generated automatically by the AI Interviewer System</p>
                <p>For questions or concerns, please contact the HR department.</p>
            </div>
        </div>
    </body>
    </html>
    """
    return template

def generate_questions_html(user_answers):
    """Generate HTML for user answers section"""
    questions_html = ""
    for index, answer in enumerate(user_answers):
        status_icon = "✅" if answer.get('answered_within_time', False) else "⏰"
        time_taken = answer.get('time_taken', 0)
        
        questions_html += f"""
        <div class="question-block">
            <div class="question-header">
                {status_icon} Question {index + 1} ({answer.get('type', 'Unknown').upper()})
            </div>
            <div class="answer">
                <strong>Answer:</strong> {answer.get('user_answer', 'No answer provided')}
            </div>
            <div class="metrics">
                <span>⏱️ Time Taken: {time_taken:.1f}s</span>
                <span>{'🕐 Within Time Limit' if answer.get('answered_within_time', False) else '⚠️ Time Exceeded'}</span>
            </div>
        </div>
        """
    return questions_html