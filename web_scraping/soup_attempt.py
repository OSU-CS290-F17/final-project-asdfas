from bs4 import BeautifulSoup
import urllib.request
import sys
import json
from datetime import datetime

def strip_whitespace(str):
    str = str.replace('\r', " ").replace("\n", " ").replace('\t', " ").replace('<br/>', " ").replace('<br>', " ")
    str = ' '.join(str.split())
    return str

start_time = datetime.now()

subject_code = sys.argv[1]
course_num = sys.argv[2]
term = sys.argv[3]

DEBUG = False
if len(sys.argv) > 4:
    DEBUG = True

catalog_URL = "http://catalog.oregonstate.edu/CourseDetail.aspx?subjectcode=" + str(subject_code) + "&coursenumber=" + str(course_num) + "&Term=201802&Campus=corvallis"

content = urllib.request.urlopen(catalog_URL).read()

soup = BeautifulSoup(content, "html.parser")

error = False if (soup.find_all(id="ctl00_ContentPlaceHolder1_lblError") == []) else True;

if (not error):
    tbody = soup.find("tbody")
    table = soup.find("table", {"id" : "ctl00_ContentPlaceHolder1_SOCListUC1_gvOfferings"})
    name = soup.find('h3')
    name_text = name.text
    prereqs_text = ""
    prereqs = soup.find("span", {"id": "ctl00_ContentPlaceHolder1_lblCoursePrereqs"})
    if prereqs:
        prereqs_text = prereqs.nextSibling

    suitable_section = []
    #https://stackoverflow.com/questions/23377533/python-beautifulsoup-parsing-table
    #first row is blank for some reason, so use [1:] to start at 2nd element
    for row in table.find_all("tr")[1:]:
        #'Cells' becomes list of data about one section
        cells = row.find_all("td")
        # cells = [ele.text.strip() for ele in cells]
        for i in range(len(cells)):
            if i != 6:
                cells[i] = strip_whitespace(cells[i].text)
            else:
                date_time_tag = cells[i]
                date_time_tag = str(cells[i].findChildren()[0])
                date_time_tag = strip_whitespace(date_time_tag)
                date_time_tag = date_time_tag[len('<font size=\"2\">'):-len('</font>')]
                cells[i] = date_time_tag
        #Want this data from list:     0: Term, 1: CRN, 2: Sec, 3: Cred, 5: Instructor, 6: Time, 
        #                              7: Location, 8: Camp, 10: Type, 11: Status, 12: Cap, 13: Cur, 14: avail
        wanted_indices = [0, 1, 2, 3, 5, 6, 7, 8, 10, 14]

        #0: Term, 1: CRN, 2: Sec, 3: Cred, 4: Instructor, 5: Time, 6: Location, 7: Camp, 8: Type, 9: Availability
        wanted_cells = [cells[i] for i in wanted_indices]

        if(wanted_cells[0] == term and wanted_cells[7] == "Corv" and int(wanted_cells[9]) > 0 
            and (cells[11].strip() == 'Open' or cells[11].strip() == 'open') and cells[6].strip() != "TBA"):
            suitable_section.append(wanted_cells)
        elif DEBUG:
            print ("ignoring, term:", wanted_cells[0], wanted_cells[0] == term, "campus:", wanted_cells[7], wanted_cells[7] == "Corv", "avail seats:", wanted_cells[9], int(wanted_cells[9]) > 0, "status", cells[11])
    file_path = subject_code + course_num + "_" + term + ".json"
    if DEBUG:
        file_path = "../web_scraping/data/" + file_path
    else:
        file_path = "web_scraping/data/" + file_path
    if len(suitable_section) >= 1:
        with open(file_path, 'w') as f:
            children = {}
            for row in suitable_section:
                date_tokens = row[5].split()
                print("Token: ", date_tokens)
                days = date_tokens[0]
                time_range = date_tokens[1]
                class_start_time = 0
                class_end_time = 0
                if (len(time_range) == 9):
                    class_start_time = int(time_range[:4])
                    class_end_time  = int(time_range[5:9])
                length_minutes = class_end_time - class_start_time

                location = ' '.join(row[6].split()[0:2])

                children[row[2]] = {'term:': row[0],
                                    'crn': row[1],
                                    'credits': row[3],
                                    'instructor': row[4],
                                    'days': days,
                                    'time': class_start_time,
                                    'time_range': time_range,
                                    'length_minutes': length_minutes,
                                    'location': location,
                                    'type': row[8],
                                    'availability': row[9]}
            container = {}
            d2 = datetime.now()
            container['course'] = subject_code + course_num
            container['name'] = strip_whitespace(name_text)
            container['prereqs'] = strip_whitespace(prereqs_text)
            #container['time_started'] = start_time.isoformat()
            container['time_retrieved'] = d2.isoformat()
            container['sections'] = children
            json.dump(container, f, indent=4)
            if DEBUG:
                print(json.dumps(container, indent=4))
            print("Done")
