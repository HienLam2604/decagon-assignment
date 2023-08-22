window.onload = function () {
	fetchData()
	calculateDates()
	renderNewLang()
	selectedDateElement.textContent = formatDate(date)
	selectedDateElement.dataset.value = selectedDate
	datePickerElement.addEventListener("click", toggleDatePicker)
	nextMonthElement.addEventListener("click", goToNextMonth)
	prevMonthElement.addEventListener("click", goToPrevMonth)
	langPickerElement.addEventListener("change", changeLang)
}

const langPickerElement = document.getElementById("lang-picker")
const datePickerElement = document.querySelector(".date-picker-wrapper")
const selectedDateElement = document.querySelector(".selected-date")
const datesElement = document.querySelector(".dates-container")
const monthElement = document.querySelector(".month .month-item")
const nextMonthElement = document.querySelector(".month .next-month")
const prevMonthElement = document.querySelector(".month .prev-month")
const daysElement = document.querySelector(".days-container")
const headerElement = document.getElementById("header")

const months = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December",
]

const viMonths = [
	"Tháng 1",
	"Tháng 2",
	"Tháng 3",
	"Tháng 4",
	"Tháng 5",
	"Tháng 6",
	"Tháng 7",
	"Tháng 8",
	"Tháng 9",
	"Tháng 10",
	"Tháng 11",
	"Tháng 12",
]

let date = new Date()
let day = date.getDate()
let month = date.getMonth() //begin is ZERO
let year = date.getFullYear()
let selectedDate = date
let selectedDay = day
let selectedMonth = month
let selectedYear = year
let enLang = {}
let viLang = {}

// Init data
const fetchData = async () => {
	const enLangResponse = await fetch("../../i18n/en.json")
	const viLangResponse = await fetch("../../i18n/vi.json")
	enLang = await enLangResponse.json()
	viLang = await viLangResponse.json()
	headerElement.innerHTML = enLang.datePicker
	headerElement.setAttribute("name", getObjectKey(enLang, enLang.datePicker))
}

// Get key of obj
function getObjectKey(obj, value) {
	return Object.keys(obj).find((key) => obj[key] === value)
}

function renderNewLang() {
	monthElement.textContent =
		langPickerElement.value === "vi"
			? viMonths[month] + " " + year
			: months[month] + " " + year
	selectedDateElement.textContent = formatDate(selectedDate)
}

const replaceText = (el) => {
	const key = el.getAttribute("name")
	el.innerText = langPickerElement.value === "vi" ? viLang[key] : enLang[key]
}

// Handle change language
function changeLang() {
	const elements = document.querySelectorAll("[data-i18n]")
	elements.forEach((el) => replaceText(el))
	renderNewLang()
}

function toggleDatePicker() {
	datesElement.classList.toggle("active")
	renderNewLang()
}

function goToNextMonth() {
	month++
	if (month > 11) {
		month = 0
		year++
	}
	toggleDatePicker()
	calculateDates()
}

function goToPrevMonth() {
	month--
	if (month < 0) {
		month = 11
		year--
	}
	toggleDatePicker()
	calculateDates()
}

function calculateDayOfMonth() {
	let totalDays = 0
	// February have 2 number of days: 28 or 29
	if (month === 1) {
		totalDays = (year % 4 === 0 && year % 100 != 0) || year % 400 === 0 ? 29 : 28
	} else if (month % 2 === 0) {
		totalDays = 31
	} else {
		totalDays = 30
	}
	return totalDays
}

//Disabled Date for the picker - do not let user pick date: Weekend and December 24th
function checkValidDay(day) {
	const dayOfWeek = day.getDay()
	const isWeekend = dayOfWeek === 0 || dayOfWeek === 6
	const isDecember24 = day.getMonth() === 11 && day.getDate() == 24 // dec 24
	return isWeekend || isDecember24
}

function calculateDates() {
	const nextWeek = new Date(date)
	nextWeek.setDate(nextWeek.getDate() + 7) // add 7 days for next week
	daysElement.innerHTML = ""
	let totalDays = calculateDayOfMonth()
	for (let i = 0; i < totalDays; i++) {
		const dayDivContain = document.createElement("div")
		dayDivContain.classList.add("day")
		dayDivContain.textContent = i + 1
		const currentDay = new Date(year + "-" + (month + 1) + "-" + (i + 1))
		const isValidDay = checkValidDay(currentDay) || currentDay.getTime() <= nextWeek.getTime()

		if (isValidDay) {
			dayDivContain.classList.add("disabled-date")
		}

		if (selectedDay === i + 1 && selectedYear === year && selectedMonth === month) {
			dayDivContain.classList.add("selected")
		}
		// add click event for every button
		dayDivContain.addEventListener("click", function () {
			selectedDate = new Date(year + "-" + (month + 1) + "-" + (i + 1))
			selectedDay = i + 1
			selectedMonth = month
			selectedYear = year
			selectedDateElement.textContent = formatDate(selectedDate)
			selectedDateElement.dataset.value = selectedDate
			calculateDates()
		})
		daysElement.appendChild(dayDivContain)
	}
}

function formatDate(selectedDate) {
	let day = selectedDate.getDate()
	if (day < 10) {
		day = "0" + day
	}
	let month = selectedDate.getMonth() + 1
	if (month < 10) {
		month = "0" + month
	}
	let year = selectedDate.getFullYear()
	return langPickerElement.value === "vi"
		? `${day}, thg${month}, ${year}`
		: `${months[selectedMonth]} ${day}, ${year}`
}
