import { Component } from "solid-js";
import { A } from "@solidjs/router";
import EmailSubscribe from "./EmailSubscribe";

import styles from "./Footer.module.scss";

const lastUpdated = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

const Footer: Component = () => {
  return (
    <footer class={styles.footer}>
      <div class={styles.container}>
        <EmailSubscribe />
        <div class={styles.bottomSection}>
          <div class={styles.links}>
            Contact: <A href="mailto:jake+jakedotgarden@uln.industries">jake@uln.industries</A> |{" "}
            <A href="https://twitter.com/jakeissnt" target="_blank" rel="noopener noreferrer">
              Twitter
            </A>{" "}
            |{" "}
            <A href="https://are.na/jake-chvatal" target="_blank" rel="noopener noreferrer">
              Are.na
            </A>
          </div>
          <p class={styles.lastUpdated}>Last updated: {lastUpdated}</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
