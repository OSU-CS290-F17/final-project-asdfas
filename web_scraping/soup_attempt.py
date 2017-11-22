from bs4 import BeautifulSoup
import urllib.request
import sys
import json
from datetime import datetime

subject_code = sys.argv[1]
course_num = sys.argv[2]
term = sys.argv[3]

catalog_URL = "http://catalog.oregonstate.edu/CourseDetail.aspx?subjectcode=" + str(subject_code) + "&coursenumber=" + str(course_num)

content = urllib.request.urlopen(catalog_URL).read()

soup = BeautifulSoup(content, "html.parser")

print("course: ", subject_code, course_num, term)
error = False if (soup.find_all(id="ctl00_ContentPlaceHolder1_lblError") == []) else True;
print("404: ", error)

if (not error):
    #print(soup.find_all(id="ctl00_ContentPlaceHolder1_lblCoursePrereqs")
    tbody = soup.find("tbody")
    table = soup.find("table", {"id" : "ctl00_ContentPlaceHolder1_SOCListUC1_gvOfferings"})
    data = []

    #https://stackoverflow.com/questions/23377533/python-beautifulsoup-parsing-table
    #first row is blank for some reason, so use [1:] to start at 2nd element
    correct_term_and_campus = []
    for row in table.find_all("tr")[1:]:
        cells = row.find_all("td")
        cells = [ele.text.strip() for ele in cells]

        #Want:
            #0: Term, 1: CRN, 2: Sec, 3: Cred, 5: Instructor, 6: Time, 7: Location, 8: Camp, 10: Type, 11: Status, 12: Cap, 13: Cur, 14: avail
        wanted_indices = [0, 1, 2, 3, 5, 6, 7, 8, 10, 11, 12, 13, 14]
        bare_wanted_indices = [0, 1, 6, 7, 8, 14]
        wanted_cells = [cells[i] for i in bare_wanted_indices]

        if(wanted_cells[0] == term and wanted_cells[4] == "Corv" and int(wanted_cells[5]) > 0):
            correct_term_and_campus.append(wanted_cells)
        else:
            print ("ignoring, term:", wanted_cells[0], "campus:", wanted_cells[4], "avail seats:", wanted_cells[5])
    file_path = "data/" + subject_code + course_num + "_" + term + ".json"
    with open(file_path, 'w') as f:
        d = datetime.now()
        json_time = json.dumps({'data_retrieved'.strip() : d.isoformat()})
        f.write(json_time + ',\n')
        for row in correct_term_and_campus:
            json.dump({'Term:': row[0],
                                'CRN': row[1],
                                'Time': row[2],
                                'Location': row[3],
                                'Availability': row[5]}, f, indent=4)
            #f.write(row_json + ',\n')