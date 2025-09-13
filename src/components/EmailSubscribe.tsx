const EmailSubscribe = () => {
  return (
    <form
      action="https://buttondown.email/api/emails/embed-subscribe/chvatal"
      method="post"
      class="embeddable-buttondown-form"
    >
      <input type="email" name="email" placeholder="you@example.com" />
      <input type="hidden" value="1" name="embed" />
      <input type="submit" value="Subscribe" />
    </form>
  );
};

export default EmailSubscribe;
