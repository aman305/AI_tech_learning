const techOptions={

"Software Development":["Python","Java","JavaScript","C++"],

"QA / Testing":["Selenium","Playwright","API Testing"],

"Data & AI":["Pandas","Machine Learning","Deep Learning"],

"DevOps":["Docker","Kubernetes","CI/CD"]

}

let userChoice={
field:"",
level:"",
mode:""
}


function selectOption(element,type){

userChoice[type]=element.innerText

const siblings=element.parentElement.querySelectorAll(".option")

siblings.forEach(opt=>opt.classList.remove("selected"))

element.classList.add("selected")

if(type==="field"){
loadTechnologies(userChoice.field)
}

}


function loadTechnologies(field){

const dropdown=document.getElementById("tech")

dropdown.innerHTML=""

techOptions[field].forEach(tech=>{

const option=document.createElement("option")

option.value=tech
option.textContent=tech

dropdown.appendChild(option)

})

}


function nextStep(step){
    if (!validateStep(step)) {
        return
    }

    document.getElementById("step" + step).classList.remove("active")
    document.getElementById("step" + (step + 1)).classList.add("active")
    updateProgress(step + 1)
}

function previousStep(step){
    document.getElementById("step" + step).classList.remove("active")
    document.getElementById("step" + (step - 1)).classList.add("active")
    updateProgress(step - 1)
}

function validateStep(step) {
    if (step === 1 && !userChoice.field) {
        alert("Please choose your field before continuing.")
        return false
    }

    if (step === 2) {
        const tech = document.getElementById("tech").value
        if (!tech) {
            alert("Please choose a technology before continuing.")
            return false
        }
    }

    if (step === 3 && !userChoice.level) {
        alert("Please choose your level before continuing.")
        return false
    }

    if (step === 4 && !userChoice.mode) {
        alert("Please choose a learning mode before starting.")
        return false
    }

    return true
}


function updateProgress(step){

let percent=(step/4)*100

document.getElementById("progressBar").style.width=percent+"%"

document.getElementById("progressText").innerText="Step "+step+" of 4"

}


function startLearning(){
    const tech = document.getElementById("tech").value
    const setup = {
        field: userChoice.field,
        technology: tech,
        level: userChoice.level,
        mode: userChoice.mode
    }

    if (!setup.field || !setup.technology || !setup.level || !setup.mode) {
        alert("Please complete all selections before starting learning.")
        return
    }

    localStorage.setItem("learningSetup", JSON.stringify(setup))
    window.location.href = "teacher.html"
}