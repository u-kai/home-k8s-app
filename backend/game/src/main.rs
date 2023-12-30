#[macro_use]
extern crate rocket;

use rocket::serde::json::Json;
use rocket::serde::Serialize;

#[derive(Serialize)]
struct Response {
    message: String,
}
#[get("/api/azure")]
fn api_azure() -> Json<Response> {
    let response: Response = Response {
        message: format!("Next Step is Learn Azure"),
    };
    Json(response)
}
#[get("/api/k8s")]
fn api_k8s() -> Json<Response> {
    let response: Response = Response {
        message: format!("Next Step is Learn K8s"),
    };
    Json(response)
}

#[get("/api/data")]
fn api_data() -> Json<Response> {
    let response: Response = Response {
        message: format!("API data!"),
    };
    Json(response)
}
#[get("/")]
fn index() -> Json<Response> {
    let response: Response = Response {
        message: format!("Hello World!"),
    };
    Json(response)
}

#[launch]
fn rocket() -> _ {
    rocket::build().mount("/", routes![api_data, index, api_azure, api_k8s])
}
