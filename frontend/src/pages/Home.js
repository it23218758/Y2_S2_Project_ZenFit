import React from "react";
import Navbar from "../components/Navbar";
import c1 from "../images/hero1.jpg";
import c2 from "../images/hero2.jpg";
import c3 from "../images/hero3.jpg";
import c4 from "../images/hero4.jpg";
import c5 from "../images/aboutus.jpg";
import { Carousel } from "react-bootstrap";
import Footer from "../components/Footer";
import FeedbackForm from "./Feedback/FeedbackForm";

const Home = () => {
  return (
    <div>
      <div className="d-flex justify-content-center align-items-center">
        <div className="w-50 rounded-3 mt-5 overflow-hidden">
          {" "}
          <Carousel>
            <Carousel.Item>
              <img
                className="d-block w-100 img-fluid object-fit-cover rounded-3"
                style={{ height: "300px" }}
                src={c1}
                alt="Slide 1"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 img-fluid object-fit-cover rounded-3"
                style={{ height: "300px" }}
                src={c2}
                alt="Slide 2"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 img-fluid object-fit-cover rounded-3"
                style={{ height: "300px" }}
                src={c3}
                alt="Slide 3"
              />
            </Carousel.Item>
            <Carousel.Item>
              <img
                className="d-block w-100 img-fluid object-fit-cover rounded-3"
                style={{ height: "300px" }}
                src={c4}
                alt="Slide 4"
              />
            </Carousel.Item>
          </Carousel>
        </div>
      </div>

      <div className="container mt-5">
        <div class="about">
          <div class="container-fluid">
            <div class="row">
              <div class="col-md-5">
                <div class="titlepage mt-5 py-5">
                  <h2>About Us</h2>
                  <p>
                  Welcome to [ZenFit Studio], your ultimate destination for health,
                   fitness, and well-being! We offer a dynamic range of wellness programs, 
                   including Zumba, Gym Workouts, Pilates, and Functional Training, designed to keep you active, 
                   energized, and feeling your best.

Our expert instructors create a motivating and supportive environment where everyone,
 from beginners to fitness enthusiasts, can thrive. Whether you want to dance your way 
 to fitness with Zumba, build strength in the gym, improve flexibility with Pilates, 
 or enjoy full-body workouts, we have something for you!

Join us and take the first step toward a stronger, healthier, and happier you. 
Let’s move, sweat, and achieve your fitness goals together!
                  </p>
                </div>
              </div>
              <div class="col-md-7">
                <div class="about_img">
                  <figure>
                    <img src={c5} className="img-fluid h-100 rounded" alt="#" />
                  </figure>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <FeedbackForm />
      <div></div>
    </div>
  );
};

export default Home;
