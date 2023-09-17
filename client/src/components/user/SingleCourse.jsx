import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "../../store/atom";
import jwt_decode from "jwt-decode";
import PaymentModal from "./PaymentModal";

function SingleCourse() {
  const [course, setCourse] = useState({});
  const id = useParams().id;
  const token = localStorage.getItem("token");
  const [message, setMessage] = useState("");
  const user = useRecoilValue(userAtom);
  const [isPurchased, setIsPurchased] = useState(false);
  const setUser = useSetRecoilState(userAtom);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const [isPaymentSuccessful, setIsPaymentSuccessful] = useState(false);

  useEffect(() => {
    if (user && user.purchasedCourses.includes(id)) {
      setIsPurchased(true);
      console.log(true);
    } else {
      console.log(false);
    }
  }, [user]);

  useEffect(() => {
    axios
      .get("https://mentor-mosaic.onrender.com/users/courses")
      .then((res) => {
        const purchasedCourse = res.data.courses.find(
          (course) => course._id === id
        );

        if (purchasedCourse) {
          setCourse(purchasedCourse);
        } else {
          // Course not purchased, you can handle this scenario as needed.
          setMessage("You haven't purchased this course.");
        }
      })
      .catch((err) => console.error(err));
  }, [id]);

  const handleClick = () => {
    if (token) {
      if (jwt_decode(token).role === "user") {
        // Open the payment modal when the "Buy Course" button is clicked
        setIsPaymentModalOpen(true);
      }
    } else {
      setMessage("You are not authenticated to buy any course");
    }
  };

  return (
    <section>
      <header
        className="py-24 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${course.imgLink})`,
        }}
      >
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-4xl font-bold text-white text-royal-green-900s">
            {course.title}
          </h1>
          <div className="text-center">
            <strong className="text-royal-green-600 font-normal text-sm inline-block my-3">
              {course.tag}
            </strong>
            <br />
          </div>
          {message ? (
            <h2 className="text-xl font-bold text-gold-900 mt-4 text-center">
              {message}
              <br />
              {token ? (
                <>
                  {jwt_decode(token).role === "user" ? (
                    <Link to={`/${user}/dashboard`}>Go to your dashbaord</Link>
                  ) : (
                    <Link to={`/login`}>Please login to buy course</Link>
                  )}
                </>
              ) : (
                ""
              )}
            </h2>
          ) : (
            ""
          )}
          {!isPurchased && (
            <>
              <strong className="text-gold-900 font-semibold text-2xl inline-block">
                ₹{course.price}
              </strong>
              <footer className="mt-4">
                <button
                  onClick={handleClick}
                  className="btn mt-4 !border-white !text-white inline-block"
                >
                  Buy Course
                </button>
              </footer>
            </>
          )}
        </div>
      </header>
      <center>
        <div className="max-w-3xl mx-auto px-6 mt-12">
          <p className=" text-royal-green-900 text-xl">{course.description}</p>
        </div>
      </center>

      {isPurchased && course.videoUrl && (
        <div className="text-center">
          <div style={{ display: "flex", justifyContent: "center" }}>
            <iframe
              title="Course Video"
              src={course.videoUrl}
              width="640"
              height="360"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      )}
      {!token && message && (
        <div className="mt-4 text-xl font-bold text-red-900 text-center">
          {message}
          <br />
          <Link to={`/login`}>Please login to buy the course.</Link>
        </div>
      )}

      <PaymentModal
        course={course}
        price={course.price}
        isOpen={isPaymentModalOpen}
        setIsOpen={setIsPaymentModalOpen}
        setIsPaymentSuccessful={setIsPaymentSuccessful}
        setMessage={setMessage} // Pass a function to set the payment message
        user={user}
        setUser={setUser}
      />
    </section>
  );
}

export default SingleCourse;
