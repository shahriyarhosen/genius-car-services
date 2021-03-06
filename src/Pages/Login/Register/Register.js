import React, { useRef, useState } from "react";
import { Button, Form } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import {
  useCreateUserWithEmailAndPassword,
  useUpdateProfile,
} from "react-firebase-hooks/auth";
import auth from "../../../Firebase/Firebase.inite";
import SocialLogin from "../SocialLogin/SocialLogin";
import Loading from "../../Loading/Loading";
import PageTitle from "../../Shared/PageTitle/PageTitle";
import { toast, useToast } from "react-toastify";
import useToken from "../../hooks/useToken";

const Register = () => {
  const [createUserWithEmailAndPassword, user, loading, error] =
    useCreateUserWithEmailAndPassword(auth, { sendEmailVerification: true });
  const [updateProfile, updating] = useUpdateProfile(auth);

  const nameRef = useRef("");
  const emailRef = useRef("");
  const passwordRef = useRef("");
  const navigate = useNavigate();
  const [agree, setAgree] = useState(false);
  const [token] = useToken(user);

  const handleNavigate = () => {
    navigate("/login");
  };

  if (loading || updating) {
    return <Loading></Loading>;
  }

  if (token) {
    navigate("/");
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const name = nameRef.current.value;
    const email = emailRef.current.value;
    const password = passwordRef.current.value;

    await createUserWithEmailAndPassword(email, password);
    await updateProfile({ displayName: name });
    toast("Updated profile");
    navigate("/home");
  };
  return (
    <div className="w-50 mx-auto">
    <PageTitle title="Register"></PageTitle>
      <h1 className="text-primary text-center mt-2">Please Register</h1>
      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control ref={nameRef} type="text" placeholder="Name" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicEmail">
          <Form.Control ref={emailRef} type="email" placeholder="Enter email" />
        </Form.Group>

        <Form.Group className="mb-3" controlId="formBasicPassword">
          <Form.Control
            ref={passwordRef}
            type="password"
            placeholder="Password"
          />
          <p>{loading ? "loading..." : ""}</p>
          <p>{error?.message}</p>
        </Form.Group>
        <Form.Group className="mb-3" controlId="formBasicCheckbox">
          <Form.Check
            onClick={() => setAgree(!agree)}
            className={agree ? "text-success" : ""}
            type="checkbox"
            label="Accept Genius Car Terms and Condition"
          />
        </Form.Group>
        <Button
          disabled={!agree}
          className="w-100 rounded-pill d-block mx-auto mb-4"
          variant="primary"
          type="submit"
        >
          Register
        </Button>
      </Form>
      <p className=" text-center mt-2">
        Already Have an account?
        <Link
          to="/login"
          onClick={handleNavigate}
          className="text-primary text-decoration-none"
        >
          Please Login
        </Link>
      </p>
      <SocialLogin></SocialLogin>
    </div>
  );
};

export default Register;
