from bs4 import BeautifulSoup
import urllib.request
import sys
import json
from datetime import datetime


def strip_whitespace(str):
    str = str.replace('\r', " ").replace("\n", " ").replace('\t', " ").replace('<br/>', " ")
    str = ' '.join(str.split())
    return str

start_time = datetime.now()

subject_code = sys.argv[1]
course_num = sys.argv[2]
term = sys.argv[3]

catalog_URL = "http://catalog.oregonstate.edu/CourseDetail.aspx?subjectcode=" + str(subject_code) + "&coursenumber=" + str(course_num)

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
        #Want this data from list:     0: Term, 1: CRN, 2: Sec, 3: Cred, 5: Instructor, 6: Time, 
        #                              7: Location, 8: Camp, 10: Type, 11: Status, 12: Cap, 13: Cur, 14: avail
        wanted_indices = [0, 1, 2, 3, 5, 6, 7, 8, 10, 14]

        #0: Term, 1: CRN, 2: Sec, 3: Cred, 4: Instructor, 5: Time, 6: Location, 7: Camp, 8: Type, 9: Availability
        wanted_cells = [cells[i] for i in wanted_indices]

        if(wanted_cells[0] == term and wanted_cells[7] == "Corv" and int(wanted_cells[9]) > 0):
            suitable_section.append(wanted_cells)
        #else:
            #print ("ignoring, term:", wanted_cells[0], "campus:", wanted_cells[4], "avail seats:", wanted_cells[5])
    file_path = "../web_scraping/data/" + subject_code + course_num + "_" + term + ".json"
    children = []
    with open(file_path, 'w') as f:
        for row in suitable_section:
            date_time_tag = row[5]
            date_time_tag = str(row[5].findChildren()[0])
            date_time_tag = date_time_tag[len('<font size=\"2\">'):-len('</font>')]
            date_tokens = date_time_tag.split()
            new_string_list = [date_tokens[i] for i in (0, 1)]
            new_string = ' '.join(new_string_list)
            days = strip_whitespace(date_time_tag)
                #.replace('<br>', '\n')
            times = "" 
            children.append({'Term:': row[0],
                                'CRN': row[1],
                                'Section': row[2],
                                'Credits': row[3],
                                'Instructor': row[4],
                                #'Days': new_string,
                                #'Time': times,
                                'Location': row[6],
                                'Type': row[8],
                                'Availability': row[9]})
        container = {}
        d2 = datetime.now()
        container['course'] = subject_code + course_num
        container['name'] = strip_whitespace(name_text)
        container['prereqs'] = strip_whitespace(prereqs_text)
        container['time_started'] = start_time.isoformat()
        container['time_retrieved'] = d2.isoformat()
        container['sections'] = children
        json.dump(container, f, indent=4)
    print("Done")
