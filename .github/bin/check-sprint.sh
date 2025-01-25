#!/bin/bash

function print_red(){
	echo -e "\e[31m$@\e[0m"
}

function print_orange(){
	echo -e "\e[33m$@\e[0m"
}

NUMBER_OF_FILES=$(ls | grep -v ^d | wc -l)

if [ $NUMBER_OF_FILES -lt 5 ]; then
  print_red "Not enough content to run tests!"
  echo "0" > sprint.txt
  exit 0
fi

if [ ! -f sprint.txt ]; then
  print_red "File 'sprint.txt' was not found!"
  exit 1
fi

SPRINT_NUMBER=$(cat sprint.txt)

if [[ $SPRINT_NUMBER != 12 && $SPRINT_NUMBER != 13 ]]; then
  len=${#SPRINT_NUMBER}
  SPRINT_NUMBER="${SPRINT_NUMBER:0:5}"

  if [[ $len -gt 5 ]]; then
    SPRINT_NUMBER="${SPRINT_NUMBER:0:5}..."
  fi
  print_red "$SPRINT_NUMBER in file 'sprint.txt' is not a valid sprint number!"
  print_orange "Use 12 or 13 depending on the print you're working on"
  exit 1
fi