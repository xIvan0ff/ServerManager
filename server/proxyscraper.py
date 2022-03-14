import time
import requests
from bs4 import BeautifulSoup
import concurrent.futures

while True:
    results = []

    start_time = time.time()

    # free-proxy-list.net free-proxy-list.net free-proxy-list.net free-proxy-list.net free-proxy-list.net
    html = requests.get('https://www.free-proxy-list.net/')
    content = BeautifulSoup(html.text, 'lxml')
    table = content.find('table')
    rows = table.findAll('tr')
    for row in rows:
        if len(row.findAll('td')):
            results.append(row.findAll('td')[
                0].text + ':' + row.findAll('td')[1].text)

    GH_URLS = [
        'https://raw.githubusercontent.com/sunny9577/proxy-scraper/master/proxies.txt',
        'https://raw.githubusercontent.com/TheSpeedX/PROXY-List/master/http.txt',
        'https://raw.githubusercontent.com/roosterkid/openproxylist/main/HTTPS_RAW.txt'
    ]

    # Github Proxy Lists
    for url in GH_URLS:
        html = requests.get(url)
        print(html.text.split("\n"))
        for row in html.text.split("\n"):
            if row.count(":") == 1:
                results.append(row.strip())

    # Create proxies final list
    final = []

    def test(proxy):
        # test each proxy on whether it access api of hh.ru
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

    # test multiple proxies concurrently
    with concurrent.futures.ThreadPoolExecutor(max_workers=65) as executor:
        executor.map(test, results)

    # to print the number of proxies
    # print(len(final))

    # save the working proxies to a file
    open("proxies.txt", "w+").write('\n'.join(final))
    print("Working", len(final), "/", len(results),
          "proxies. Execution took [", round((time.time() - start_time), 2), "] seconds.")

    time.sleep(5 * 60 * 1000)
