# Ames Ride API

When using public transportation, it is vital to know where your bus is.
In Ames, Iowa, there are two existing applications which attempt to cater to this need.
With ratings on the Play Store of 1.9 stars and 2.3 stars, the existing solutions are unreliable and unmaintained.

**Ames Ride** strives to be a reliable, modern application that informs riders of current bus locations and arrival times.

The frontend of the application is written in React Native and can be viewed [here](https://github.com/patrickdemers6/AmesRide).

# Overview

This is the backend which will eventually be used to power Ames Ride.
When a user wants to subscribe to vehicle locations or upcoming arrivals, they send the request using a Websocket connection to this backend. Upon receiving a request, this backend subscribes the user to receive updates.
Whenever new data is available for the route or bus stop the user cares about, a new message will be sent with updated information.

Currently, the front end is using a pull system in which it polls the CyRide API for updated information. This places strain on the server and would render the application obsolete if an API change occured.

This project is designed to be as data-source agnostic as possible, allowing for easy modifications to the data retreival process if/when it is needed.

# Current State

Currently, this API is in active development. It works well with the [beta frontend](https://github.com/patrickdemers6/AmesRide/tree/websockets), but additional testing is needed before it is ready to be rolled out to the public. Please open an issue if you would like to get involved in beta testing.

# Privacy

Ames Ride is a privacy respecting application and has no intention of capturing or profiting from user data.

- This backend only receives route and stop information from a user. This is used to provide upcoming arrival and vehicle locations.
- There is no tracking between sessions. As soon as the connection to the backend terminates (by closing the app), the session is completely forgotten about.
- Any collection of analytics is broad and anonymized. Examples include the number of users connected to the backend at a given time or number of vehicle location requests. Data is aggregated using Grafana.