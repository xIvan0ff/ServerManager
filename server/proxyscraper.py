import time
import requests
from bs4 import BeautifulSoup
import concurrent.futures

GH_URLS = [
    'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
    'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
    'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt'
]


def main():

    results = []

    start_time = time.time()

    html = requests.get('https://www.free-proxy-list.net/')
    content = BeautifulSoup(html.text, 'lxml')
    table = content.find('table')
    rows = table.findAll('tr')
    for row in rows:
        if len(row.findAll('td')):
            results.append(row.findAll('td')[
                0].text + ':' + row.findAll('td')[1].text)

    for url in GH_URLS:
        html = requests.get(url)
        for row in html.text.split("\n"):
            if row.count(":") == 1:
                results.append(row.strip())

    final = []

    def test(proxy):

        headers = {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:80.0) Gecko/20100101 Firefox/80.0'}
        try:
            params = {
                'text': f'NAME:C++',
                'area': 113,
                'page': 0,
                'per_page': 100
            }
            requests.get('https://api.hh.ru/vacancies', headers=headers,
                         proxies={'http': proxy}, timeout=5, params=params)
            final.append(proxy)
        except:
            pass
        return proxy

    with concurrent.futures.ThreadPoolExecutor(max_workers=20) as executor:
        executor.map(test, results)

    open("proxies.txt", "w+").write('\n'.join(final))
    print("Working", len(final), "/", len(results),
          "proxies. Execution took [", round((time.time() - start_time), 2), "] seconds.")
