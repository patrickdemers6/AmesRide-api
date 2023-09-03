# Ames Ride API

When using public transportation, it is vital to know where your bus is.
In Ames, Iowa, there are two existing applications which attempt to cater to this need.
With ratings on the Play Store of 1.9 stars and 2.3 stars, the existing solutions are unreliable and unmaintained.

**Ames Ride** strives to be a reliable, modern application that informs riders of current bus locations and arrival times.

The frontend of the application is written in React Native and can be viewed [here](https://github.com/patrickdemers6/AmesRide).

# Overview

This is the backend used to power Ames Ride.
When a user wants to subscribe to vehicle locations or upcoming arrivals, the frontend sends the request using a Websocket connection to this backend. 
Whenever new data is available for the route or bus stop the user cares about, a new message is sent with updated information.

This project is designed to be as data-source agnostic as possible, allowing for easy modifications to the data retreival process.

# Privacy

Ames Ride is a privacy respecting application and has no intention of capturing or profiting from user data.

- This backend only receives route and stop information from a user. This is used to provide upcoming arrival and vehicle locations.
- There is no tracking between sessions. As soon as the connection to the backend terminates (by closing the app), the session is completely forgotten about.
- Any collection of analytics is broad and anonymized. Examples include the number of users connected to the backend at a given time or number of vehicle location requests. Data is published using Prometheus and analyzed in Grafana.