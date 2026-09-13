import { Link } from 'react-router-dom';
import { useBusiness } from '../context/BusinessContext';

export default function PageHead({ title, description, crumbs = [] }) {
  const { features } = useBusiness();
  return (
    <>
      {features.show_breedcrumb && crumbs.length > 0 && (
        <div className="breadcrumb">
          <Link to="/">Home</Link>
          {crumbs.map((c, i) => (
            <span key={c.label} style={{ display: 'contents' }}>
              <span>/</span>
              {c.to && i < crumbs.length - 1
                ? <Link to={c.to}>{c.label}</Link>
                : <span className="current">{c.label}</span>}
            </span>
          ))}
        </div>
      )}
      <div className="page-head">
        <h1>{title}</h1>
        {description && <p>{description}</p>}
      </div>
    </>
  );
}
