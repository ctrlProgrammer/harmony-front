"use client";

import Image from "next/image";
import styles from "./home.module.css";
import { useState } from "react";
import { APIUtils } from "@/app/core/utils/api";
import { User } from "@/app/core/types";
import { validateEmail } from "@/app/core/utils/global";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export const HomePage = () => {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [create, setCreate] = useState(false);

  const join = () => {
    console.log(email);
    if (!validateEmail(email)) {
      toast.error("Invalid email");
      return;
    }

    if (password == "") {
      toast.error("Invalid password");
      return;
    }

    APIUtils.Login({ email, password } as User).then((data) => {
      if (!data || data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Success");
      router.push("/dashboard");
    });
  };

  const createUser = () => {
    if (!validateEmail(email)) {
      toast.error("Invalid email");
      return;
    }

    if (password == "") {
      toast.error("Invalid password");
      return;
    }

    APIUtils.CreateUser({ name, password, role, email } as User).then((data) => {
      if (!data || data.error) {
        toast.error(data.error);
        return;
      }

      toast.success("Created user");
      setCreate(false);
      setPassword("");
    });
  };

  return (
    <div className={styles.login}>
      <Image className={styles.background} width={1577} height={759} src={"/images/google_maps.jpg"} alt="bogota google maps " />
      <div>
        <h4>Harmony</h4>
        <p>Global Actionable Knowledge</p>
        {create ? (
          <div>
            <div>
              <label htmlFor="">Email</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} name="email" type="email" placeholder="example@gmail.com" />
            </div>
            <div>
              <label htmlFor="">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} name="name" type="text" placeholder="Example Name" />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} name="password" type="password" placeholder="******************" />
            </div>
            <div>
              <label htmlFor="">Role</label>
              <select name="" id="" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ADMIN">ADMIN</option>
                <option value="SALES_MANAGER">SALES MANAGER</option>
                <option value="MARKETING_MANAGER">MARKETING MANAGER</option>
              </select>
            </div>
            <button onClick={() => createUser()}>Create</button>
            <button style={{ background: "grey" }} onClick={() => setCreate(false)}>
              Join
            </button>
          </div>
        ) : (
          <div>
            <div>
              <label htmlFor="">Email</label>
              <input name="email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="example@gmail.com" />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <input name="password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="******************" />
            </div>
            <button onClick={() => join()}>Join</button>
            <button style={{ background: "grey" }} onClick={() => setCreate(true)}>
              Create user
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
