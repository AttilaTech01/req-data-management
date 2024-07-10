name = "Les Constructions Galilée"
import re
from difflib import SequenceMatcher
def shorted_name_validation(compnany_name):
    name = name.split(" ")
    listLetter = []
    for word in name:
        listLetter.append([x for x in word][0])
        
    letter = "".join(map(str, listLetter))


    

    return letter
