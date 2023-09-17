import React from "react";
import { Dialog, Transition } from "@headlessui/react";
import { Fragment } from "react";
import axios from "axios";

const PaymentModal = ({
  course,
  price,
  isOpen,
  setIsOpen,
  setIsPaymentSuccessful,
  setMessage,
  user,
  setUser,
}) => {
  const closeModal = () => {
    setIsOpen(false);
  };

  const token = localStorage.getItem("token");

  const launchRazorPay = () => {
    if (open) {
      let options = {
        key: "rzp_test_3mwAsetJPN4JkR",
        amount: course.price * 100,
        currency: "INR",
        name: course.name,
        description: course.description,
        image:
          "https://www.pngitem.com/pimgs/m/445-4458777_m-logo-calligraphy-hd-png-download.png",
        handler: () => {
          setIsOpen(false);
          setIsPaymentSuccessful(true); // Set payment success state to true
          setMessage("");
          axios
            .post(`https://mentor-mosaic.onrender.com/users/courses/${course._id}`, null, {
              headers: {
                authorization: token,
              },
            })
            .then((res) => {
              let updatedCourses = [...user.purchasedCourses];
              updatedCourses.push(course._id);
              setUser({ ...user, purchasedCourses: updatedCourses });
            })
            .catch((err) => console.error(err));
          setMessage("Payment Successful");
        },
        theme: { color: "#c4242d" },
      };

      let razorPay = window.Razorpay(options);
      razorPay.open();
    }
  };

  return (
    <>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-50" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Please make a payment
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Hello please click non the below button to make a payment.
                    </p>
                  </div>

                  <div className="mt-4 flex gap-3">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-500 px-4 py-2 text-sm font-medium text-white hover:bg-red-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={launchRazorPay}
                    >
                      Pay ₹{price}
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={closeModal}
                    >
                      Cancel Payment
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default PaymentModal;
