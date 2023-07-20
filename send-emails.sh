#!/bin/bash

emailtextsdir=$1

if [[ ! $emailtextsdir ]]; then
  printf "Usage: ./send-emails.sh <directory containing email text files to send>\n";
  exit 1;
fi

cd ${emailtextsdir}
for file in *;
    do
        echo "${file}"
        printf "To: %s\n" "${file}" | sendmail "$file" < "$file"
    done
