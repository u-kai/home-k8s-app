#[macro_use]
extern crate rocket;

use rocket::serde::json::Json;
use rocket::serde::{self, Serialize};

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
//#[get("/api/timer")]
//fn api_timer() -> Json<Response> {
//    match std::env::var("TIMER_PATH") {
//        Ok(path) => {
//           match std::fs::read_to_string(path) {
//               Ok(content)=>{
//                   #[derive(serde::Deserialize)]
//                   struct Timer {
//                       start : String,
//                   }
//                   match serde::json::from_str::<Timer>(&content) {
//                       Ok(timer)=>{
//                           let response: Response = Response {
//                               message: format!("Timer is {}",timer.start),
//                           };
//                           return Json(response);
//                       },
//                       Err(_)=>{
//                   }
//
//               },
//               Err(_)={},
//           }
//        }
//        Err(_)=>{}
//    };
//}
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
