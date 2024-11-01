import os 

with open('filenames.txt', 'r') as infile, open('codebase.txt', 'w') as outfile:
    for filename in infile:
        filename = filename.strip() 
        filepath = os.path.join(os.getcwd(), filename) 

        outfile.write(f"\n\n# Filename: {filename}\n# Path: {filepath}\n\n")

        with open(filepath, 'r', encoding='utf-8') as codefile:
            outfile.write(codefile.read())