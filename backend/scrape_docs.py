import os
import time
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse
import re

# Config: URLs for each language
URLS = {
    "java": [
        "https://docs.oracle.com/en/java/","https://docs.oracle.com/javase/tutorial/","https://stackoverflow.com/questions/tagged/java","https://github.com/openjdk/jdk","https://www.baeldung.com/","https://www.javatpoint.com/","https://www.geeksforgeeks.org/java/","https://www.tutorialspoint.com/java/index.htm","https://www.jetbrains.com/help/idea/using-java.html","https://www.vogella.com/tutorials/Java/article.html","https://www.journaldev.com/java","https://www.programiz.com/java-programming","https://www.codementor.io/@codewithshad/java-tutorial-for-beginners-1151xkw0hw","https://www.javaworld.com/","https://www.baeldung.com/java-8-streams","https://www.journaldev.com/178/java-string-examples","https://github.com/spring-projects/spring-framework","https://www.learnjavaonline.org/","https://www.sitepoint.com/java/","https://www.w3schools.com/java/","https://www.digitalocean.com/community/tutorials/java-strings-in-depth","https://github.com/iluwatar/java-design-patterns","https://www.programcreek.com/java-api-examples/","https://www.javadevjournal.com/","https://dzone.com/java-jdk-development-tutorials-tools-news","https://www.eclipse.org/community/eclipse_newsletter/2019/february/article2.php","https://www.redhat.com/en/topics/java","https://www.java67.com/","https://javarevisited.blogspot.com/","https://www.vogella.com/tutorials/java.html","https://www.java-made-easy.com/","https://docs.spring.io/spring-framework/docs/current/reference/html/","https://www.hackerrank.com/domains/tutorials/10-days-of-java","https://www.learnjavaonline.org/","https://www.freecodecamp.org/news/java-tutorial-for-beginners/","https://github.com/iluwatar/java-design-patterns","https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/","https://medium.com/tag/java","https://www.codecademy.com/learn/learn-java","https://www.java-examples.com/","https://www.javacodegeeks.com/","https://www.stackoverflow.com/tags/java","https://javabrains.io/","https://www.geeksforgeeks.org/java/","https://github.com/Netflix/zuul","https://www.baeldung.com/java-collections","https://www.oracle.com/java/technologies/javase-downloads.html","https://www.journaldev.com/229/java-8-lambda-expressions","https://github.com/junit-team/junit5","https://github.com/square/okhttp"

    ],
    "python": [
        "https://docs.python.org/3/","https://realpython.com/","https://pypi.org/","https://www.python.org/dev/peps/","https://www.geeksforgeeks.org/python-programming-language/","https://www.tutorialspoint.com/python/index.htm","https://stackoverflow.com/questions/tagged/python","https://www.programiz.com/python-programming","https://github.com/python/cpython","https://www.w3schools.com/python/","https://automatetheboringstuff.com/","https://www.datacamp.com/community/tutorials/python-tutorials","https://www.pythonforbeginners.com/","https://www.freecodecamp.org/news/learn-python-basics/","https://realpython.com/python3-object-oriented-programming/","https://docs.python-guide.org/","https://pythonbasics.org/","https://github.com/psf/requests","https://numpy.org/doc/","https://pandas.pydata.org/docs/","https://www.machinelearningmastery.com/start-here/","https://scipy.org/docs.html","https://www.kaggle.com/learn/python","https://www.hackerrank.com/domains/python","https://medium.com/tag/python","https://www.learnpython.org/","https://www.codecademy.com/learn/learn-python-3","https://github.com/tiangolo/fastapi","https://flask.palletsprojects.com/en/latest/","https://www.python.org/about/apps/","https://github.com/django/django","https://www.datacamp.com/community/tutorials/introduction-to-pandas","https://docs.python-requests.org/en/latest/","https://github.com/pallets/flask","https://realpython.com/tutorials/django/","https://github.com/scikit-learn/scikit-learn","https://github.com/pandas-dev/pandas","https://www.analyticsvidhya.com/blog/2021/06/python-for-data-science-using-jupyter-notebooks/","https://www.machinelearningplus.com/python/python-tutorial/","https://www.pythoncheatsheet.org/","https://docs.python.org/3/tutorial/","https://pythonbasics.org/","https://www.dataquest.io/blog/python-tutorial/","https://realpython.com/python-data-structures/","https://github.com/keras-team/keras","https://github.com/pytorch/pytorch","https://scikit-learn.org/stable/","https://www.tensorflow.org/tutorials"
    ],
    "javascript": [
        "https://developer.mozilla.org/en-US/docs/Web/JavaScript","https://javascript.info/","https://www.w3schools.com/js/","https://stackoverflow.com/questions/tagged/javascript","https://github.com/tc39/ecma262","https://github.com/jquery/jquery","https://reactjs.org/","https://nodejs.org/en/docs/","https://www.freecodecamp.org/learn/javascript-algorithms-and-data-structures/","https://eloquentjavascript.net/","https://medium.com/tag/javascript","https://www.geeksforgeeks.org/javascript-tutorial/","https://www.tutorialspoint.com/javascript/index.htm","https://www.codecademy.com/learn/introduction-to-javascript","https://www.sitepoint.com/javascript/","https://www.javascripttutorial.net/","https://github.com/vuejs/vue","https://angular.io/docs","https://www.typescriptlang.org/docs/","https://github.com/expressjs/express","https://www.digitalocean.com/community/tutorial_series/javascript","https://javascript30.com/","https://dev.to/t/javascript","https://www.smashingmagazine.com/category/javascript/","https://www.javascript.com/","https://www.geeksforgeeks.org/javascript-closures/","https://www.freecodecamp.org/news/learn-javascript-full-course/","https://www.taniarascia.com/javascript-tutorial-for-beginners/","https://www.sitepoint.com/understanding-javascript-closures/","https://www.udemy.com/course/the-complete-javascript-course/","https://www.pluralsight.com/courses/javascript-fundamentals","https://javascript.info/async","https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules","https://www.javascript.com/resources","https://github.com/facebook/react","https://github.com/nodejs/node","https://www.npmjs.com/","https://javascriptweekly.com/","https://www.hackerrank.com/domains/tutorials/10-days-of-javascript","https://www.khanacademy.org/computing/computer-programming/programming","https://jsfiddle.net/","https://codepen.io/"

    ],
}

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) " +
                  "AppleWebKit/537.36 (KHTML, like Gecko) " +
                  "Chrome/114.0.0.0 Safari/537.36"
}

CHUNK_SIZE = 800  # Approx words per chunk
BASE_DIR = os.path.join(os.getcwd(), "docs")


def clean_text(html_text):
    # Use BeautifulSoup to clean html tags/scripts/styles
    soup = BeautifulSoup(html_text, "html.parser")

    # Remove script and style elements
    for script_or_style in soup(["script", "style", "header", "footer", "nav", "aside", "form"]):
        script_or_style.decompose()

    text = soup.get_text(separator="\n")

    # Clean and normalize
    lines = [line.strip() for line in text.splitlines()]
    text = "\n".join(line for line in lines if line)

    # Remove multiple newlines and excessive spaces
    text = re.sub(r"\n{2,}", "\n\n", text)
    text = re.sub(r"[ \t]{2,}", " ", text)

    return text


def chunk_text(text, size=CHUNK_SIZE):
    words = text.split()
    chunks = []
    for i in range(0, len(words), size):
        chunk = " ".join(words[i:i + size])
        chunks.append(chunk)
    return chunks


def safe_filename(name):
    # Make filename safe for filesystem
    return re.sub(r"[^\w\-_. ]", "_", name)[:50]


def scrape_and_save(url, language, index):
    try:
        print(f"Scraping: {url}")
        resp = requests.get(url, headers=HEADERS, timeout=15)
        resp.raise_for_status()
    except Exception as e:
        print(f"Failed to fetch {url}: {e}")
        return 0

    text = clean_text(resp.text)
    chunks = chunk_text(text)

    save_dir = os.path.join(BASE_DIR, language)
    os.makedirs(save_dir, exist_ok=True)

    count = 0
    for idx, chunk in enumerate(chunks):
        fname = f"{safe_filename(urlparse(url).netloc)}_{index}_{idx}.txt"
        path = os.path.join(save_dir, fname)
        with open(path, "w", encoding="utf-8") as f:
            f.write(chunk)
        count += 1

    print(f"Saved {count} chunks for {url}")
    return count


def main():
    total_chunks = 0
    for language, urls in URLS.items():
        print(f"\nProcessing language: {language.upper()}")
        for i, url in enumerate(urls):
            saved = scrape_and_save(url, language, i)
            total_chunks += saved
            time.sleep(2)  # polite delay
    print(f"\nScraping complete! Total chunks saved: {total_chunks}")


if __name__ == "__main__":
    main()
