#[macro_use]
extern crate rocket;

use rocket::serde::json::Json;
use rocket::serde::Serialize;

#[derive(Serialize)]
struct Response {
    message: String,
}

#[get("/api/data")]
fn api_data() -> Json<Response> {
    let response: Response = Response {
        message: format!("Hello World!"),
    };
    Json(response)
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![api_data])
}
