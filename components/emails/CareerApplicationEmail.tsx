type CareerApplicationEmailProps = {
  fullName: string;
  email: string;
  role: string;
  message: string;
};

export default function CareerApplicationEmail({
  fullName,
  email,
  role,
  message,
}: CareerApplicationEmailProps) {
  return (
    <div>
      <h1>New Career Application</h1>
      <p>
        <strong>Full Name:</strong> {fullName}
      </p>
      <p>
        <strong>Email:</strong> {email}
      </p>
      <p>
        <strong>Role:</strong> {role}
      </p>
      <p>
        <strong>Message:</strong>
      </p>
      <p>{message}</p>
    </div>
  );
}
