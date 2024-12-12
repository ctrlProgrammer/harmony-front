"use client";

import Image from "next/image";
import styles from "./home.module.css";
import { useState } from "react";

export const HomePage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [role, setRole] = useState("ADMIN");
  const [create, setCreate] = useState(false);

  const join = () => {};

  const createUser = () => {};

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
              <input value={email} onChange={(e) => setEmail(e.target.value)} type="text" placeholder="example@gmail.com" />
            </div>
            <div>
              <label htmlFor="">Name</label>
              <input value={name} onChange={(e) => setName(e.target.value)} type="text" placeholder="Example Name" />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <input value={password} onChange={(e) => setPassword(e.target.value)} type="password" placeholder="******************" />
            </div>
            <div>
              <label htmlFor="">Role</label>
              <select name="" id="" value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="ADMIN">ADMIN</option>
                <option value="SALES_MANAGER">SALES MANAGER</option>
                <option value="MARKETING_MANAGER">MARKETING MANAGER</option>
              </select>
            </div>
            <button>Create user</button>
            <button onClick={() => setCreate(false)}>Join</button>
          </div>
        ) : (
          <div>
            <div>
              <label htmlFor="">Email</label>
              <input type="text" placeholder="example@gmail.com" />
            </div>
            <div>
              <label htmlFor="">Password</label>
              <input type="password" placeholder="******************" />
            </div>
            <button>Join</button>
            <button onClick={() => setCreate(true)}>Create user</button>
          </div>
        )}
      </div>
    </div>
  );
};
