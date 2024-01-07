# build the app.
FROM rust:1.71 AS build-env

# set the working dir.
WORKDIR /app

# copy the source and dependencies of the app.
COPY . .

# build the app.
RUN cargo build --release

# set up the container.
FROM debian:12-slim

# set the working dir.
WORKDIR /app

# copy the built app binary from the build-env.
COPY --from=build-env /app/target/release/game ./app

# set the environment variable.
ENV ROCKET_ADDRESS=0.0.0.0

# expose the port.
EXPOSE 8000

# command to run the app.
CMD ["./app"]
