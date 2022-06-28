import { fetchMovieAvailability, fetchMovieList } from "./api.js"
let selectedSeat = new Set();

// Success Purchase
function success() {
    document.getElementById('customer-detail-form').addEventListener('submit', (e) => {
        e.preventDefault();
        let email = document.getElementById('email').value;
        let phone = document.getElementById('mobile').value;

        let seats = [];
        selectedSeat.forEach((seat) => {
            seats.push(seat);
        })

        let booker = document.getElementById('booker');
        booker.innerHTML = '';

        let div = document.createElement('div');
        div.setAttribute('id', 'Success');
        div.innerHTML = `
            <h4>Booking details</h4>
            <p>Seats: ${seats.join(",")}</p>
            <p>Phone Number: ${phone}</p>
            <p>Email: ${email}</p>
        `
        booker.appendChild(div);
    })
}



// Insert Loader
const insertLoader = () => {
    let main = document.querySelector('main');
    let loader = document.createElement('p');
    loader.setAttribute('id', 'loader');
    loader.innerText = 'Loading. ';

    main.appendChild(loader);
}

// Remove Loader
const removeLoader = () => {
    document.getElementById('loader').remove();
}

// Add Movie Holder
const movieHolder = () => {
    let main = document.querySelector('main');
    let movieHolder = document.createElement('div');
    movieHolder.classList.add('movie-holder');
    movieHolder.style.display = 'flex';
    movieHolder.style.padding = '2rem  2rem';
    movieHolder.style.justifyContent = 'center';
    main.appendChild(movieHolder);
}

// Render Movie list
const renderMovieList = (list) => {
    let movieHolder = document.querySelector('.movie-holder');

    list.map((movie) => {
        let a = document.createElement('a');
        a.classList.add('movie-link');
        a.setAttribute('href', '#');
        a.style.height = '200px'
        a.style.width = '200px'
        a.innerHTML = `
        <div class="movie" data-id='${movie.name}'>
        <div class="movie-img-wrapper" style="background-image: url('${movie.imgUrl}'); background-repeat: no-repeat;background-size: contain; height: 200px; width: 150px;"> </div> 
        <h4>${movie.name}</h4> </div>
        `
        movieHolder.appendChild(a);
    })
}




// Toggle Seat Selector
const toggleHeading = () => {
    document.querySelector('h3').classList.toggle('v-none');
}

// Confirm Seats
const confirmSeats = () => {
    let booker = document.getElementById('booker');

    // Clear booker
    booker.innerHTML = '';

    // Render new confirm form
    let div = document.createElement('div');
    div.setAttribute('id', 'confirm-purchase');

    let seats = [];
    selectedSeat.forEach((seat) => {
        seats.push(seat);
    })

    div.innerHTML = `
        <h3>Confirm your booking for seat numbers:${seats.join(",")}</h3>
        <form id="customer-detail-form" action="">
            <label for="email">Email: </label>
            <input type="email" id="email" required><br><br>
            <label for="phone-number">Phone Number: </label>
            <input type="tel" id="mobile" required>
            <br><br>
            <button type="submit">Purchase</button>
        </form>
    `
    booker.appendChild(div);

    success();
}

// Check Seat Selected
const checkSeatSelected = () => {
    if (selectedSeat.size != 0) {
        document.getElementById('book-ticket-btn').classList.remove('v-none');

        document.getElementById('book-ticket-btn')
            .addEventListener('click', confirmSeats);
    } else {
        document.getElementById('book-ticket-btn').classList.add('v-none')
    }
}

// Generate Seat Grid
const generateSeatGrid = (start, end, unavailableSeats) => {
    let grid = document.createElement('div');
    grid.classList.add('booking-grid');

    for (let i = start; i <= end; i++) {
        let cell = document.createElement('div');
        cell.classList.add('grid-cell');
        cell.setAttribute('id', `booking-grid-${i}`);
        if (unavailableSeats.includes(i)) {
            cell.classList.add('unavailable-seat');
        } else {
            cell.classList.add('available-seat');

            cell.addEventListener('click', () => {
                cell.classList.toggle('selected-seat');

                if (cell.classList.contains('selected-seat')) {
                    selectedSeat.add(i);
                } else if (!cell.classList.contains('selected-seat')) {
                    selectedSeat.delete(i);
                }
                checkSeatSelected();
            })
        }
        cell.innerText = i;
        grid.appendChild(cell);
    }

    return grid;
}

// Render Seat Grid
const renderSeatGrid = (unavailableSeats) => {
    let bookerGridHolder = document.getElementById('booker-grid-holder');
    bookerGridHolder.innerHTML = '';

    let leftGrid = generateSeatGrid(1, 12, unavailableSeats);
    let rightGrid = generateSeatGrid(13, 24, unavailableSeats);

    bookerGridHolder.appendChild(leftGrid);
    bookerGridHolder.appendChild(rightGrid);
}


// Select Seats
const getSeats = async (movieName) => {
    await fetchMovieAvailability(movieName)
        .then(response => {
            document.querySelector('h3').classList.add('v-none');
            // Toggle Header
            toggleHeading();

            // Render Seat Grid
            renderSeatGrid(response);
        })
        .catch((e) => {
            console.log(e);
        })
}

// await new Promise((resolve) => setTimeout(resolve, 600));

const addListener = () => {
    let links = document.querySelectorAll('a');
    links.forEach((items) => {
        items.addEventListener('click', (e) => {
            let movieName = e.target.parentNode.children[1].innerText;
            getSeats(movieName);
        })
    })
}



const getMovieList = async () => {
    // Insert Loader
    insertLoader()

    await fetchMovieList()
        .then(response => {
            // Remove Loader
            removeLoader()

            // Insert Movie Holder
            movieHolder();

            // Render movie List
            renderMovieList(response);

            addListener();
        })
        .catch((e) => {
            console.log(e)
        })
}

getMovieList();