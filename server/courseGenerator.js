export function generateCourse(track, level){

if(track === "Python"){

return [

"Introduction to Python",
"Print Statements",
"Variables",
"Data Types",
"User Input",
"Conditional Statements",
"Loops",
"Functions",
"Lists",
"Dictionaries",
"Modules",
"File Handling",
"Error Handling",
"Object Oriented Programming",
"Mini Project"

]

}

if(track === "Selenium"){

return [

"Automation Testing Basics",
"Selenium Setup",
"WebDriver",
"Locators",
"Browser Actions",
"Waits",
"Handling Alerts",
"Handling Frames",
"Test Framework Design",
"Page Object Model",
"CI Integration"

]

}

if(track === "Flutter"){

return [

"Flutter Introduction",
"Dart Basics",
"Widgets",
"Layouts",
"Navigation",
"State Management",
"API Integration",
"Firebase",
"UI Design",
"Mini Project"

]

}

return [

"Introduction",
"Basic Concepts",
"Practice",
"Advanced Concepts",
"Project"

]

}