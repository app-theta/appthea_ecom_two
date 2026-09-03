export default function AccountHead({ title, description }) {
  return (
    <div className="account-head">
      <h1>{title}</h1>
      {description && <p>{description}</p>}
    </div>
  );
}
