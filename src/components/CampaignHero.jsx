import { Link } from 'react-router-dom';
import Countdown from './Countdown';
import { Icon } from './Icons';
import { imageUrl, plain } from '../utils/product';

/**
 * A running campaign's banner: its image (or a plain colour block), title, countdown to the end
 * and - on the home page - a link to the campaign page. `onEnd` runs when the countdown hits zero.
 */
export default function CampaignHero({ campaign, onEnd, linked = true, as: Title = 'h2' }) {
  const banner = imageUrl(campaign.banner);
  const about = plain(campaign.description);

  return (
    <div className={`campaign-hero${banner ? ' has-banner' : ''}`}>
      {banner && <img className="campaign-hero__img" src={banner} alt="" loading="lazy" />}
      <div className="campaign-hero__body">
        <p className="campaign-hero__eyebrow"><Icon.bolt width="14" height="14" /> Campaign</p>
        <Title className="campaign-hero__title">{campaign.title}</Title>
        {about && <p className="campaign-hero__about">{linked && about.length > 140 ? `${about.slice(0, 139)}…` : about}</p>}
        {linked && (
          <Link to={`/campaign/${campaign.slug}`} className="btn campaign-hero__cta">
            Shop the campaign{campaign.products_count > 0 && ` (${campaign.products_count})`}
            <Icon.arrowRight width="16" height="16" />
          </Link>
        )}
      </div>
      {/* the countdown sits on the right (below the text on a phone) */}
      <div className="campaign-hero__ends">
        <span className="campaign-hero__ends-label">Ends in</span>
        <Countdown endsAt={campaign.ends_at} onEnd={onEnd} className="countdown--light" />
      </div>
    </div>
  );
}
