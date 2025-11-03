import { escapeHtml } from '../utils/escapeHtml.js';

const buildStyles = (campaign) => `
  :root {
    color-scheme: light;
    font-family: 'Inter', system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
  }

  body, html {
    margin: 0;
    padding: 0;
    height: 100%;
    background: #0f172a;
    color: #0f172a;
  }

  .main-frame {
    width: 100%;
    height: 100vh;
    border: none;
  }

  .popup-overlay {
    position: fixed;
    inset: 0;
    display: none;
    background: rgba(15, 23, 42, 0.65);
    backdrop-filter: blur(4px);
    z-index: 9999;
    align-items: center;
    justify-content: center;
  }

  .popup {
    width: min(900px, 90vw);
    height: min(600px, 85vh);
    background: #fff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 25px 50px -12px rgba(30, 64, 175, 0.45);
    display: flex;
    flex-direction: column;
  }

  .popup header {
    padding: 16px 20px;
    font-weight: 600;
    color: #fff;
    background: ${campaign.backgroundColor || '#1d4ed8'};
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  .popup header button {
    background: rgba(255, 255, 255, 0.2);
    border: none;
    color: #fff;
    border-radius: 999px;
    padding: 6px 14px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .popup iframe {
    flex: 1;
    border: none;
    width: 100%;
  }

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    border: 0;
  }
`;

export const renderCampaignPage = (campaign) => `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>${escapeHtml(campaign.pageTitle)}</title>
    <style>
      ${buildStyles(campaign)}
    </style>
  </head>
  <body>
    <span class="sr-only" id="campaign-data" data-campaign='${JSON.stringify({
      delayPopupUrl: campaign.delayPopupUrl,
      delayPopupDelaySeconds: campaign.delayPopupDelaySeconds,
      delayPopupCloseUrl: campaign.delayPopupCloseUrl,
      exitPopupUrl: campaign.exitPopupUrl,
      exitPopupCloseUrl: campaign.exitPopupCloseUrl,
      backgroundColor: campaign.backgroundColor,
    })}'></span>
    <iframe class="main-frame" src="${escapeHtml(campaign.squeezePageUrl)}" title="${escapeHtml(campaign.name)}"></iframe>

    <div class="popup-overlay" id="delay-popup" role="dialog" aria-modal="true" aria-labelledby="delay-popup-title">
      <div class="popup">
        <header>
          <span id="delay-popup-title">Special Offer</span>
          <button data-close-popup="delay">Close</button>
        </header>
        <iframe src="about:blank" id="delay-popup-frame" title="Delay Popup"></iframe>
      </div>
    </div>

    <div class="popup-overlay" id="exit-popup" role="dialog" aria-modal="true" aria-labelledby="exit-popup-title">
      <div class="popup">
        <header>
          <span id="exit-popup-title">Wait! Before You Go...</span>
          <button data-close-popup="exit">Close</button>
        </header>
        <iframe src="about:blank" id="exit-popup-frame" title="Exit Popup"></iframe>
      </div>
    </div>

    <script>
      const campaignData = JSON.parse(document.getElementById('campaign-data').dataset.campaign);

      const delayOverlay = document.getElementById('delay-popup');
      const exitOverlay = document.getElementById('exit-popup');
      const delayFrame = document.getElementById('delay-popup-frame');
      const exitFrame = document.getElementById('exit-popup-frame');

      const delayCloseBtn = delayOverlay.querySelector('[data-close-popup="delay"]');
      const exitCloseBtn = exitOverlay.querySelector('[data-close-popup="exit"]');

      const openPopup = (overlay, frame, url) => {
        if (!url) return;
        frame.src = url;
        overlay.style.display = 'flex';
      };

      const closePopup = (overlay, frame, nextUrl) => {
        overlay.style.display = 'none';
        frame.src = 'about:blank';
        if (nextUrl) {
          window.open(nextUrl, '_blank', 'noopener');
        }
      };

      let delayTimer;
      if (campaignData.delayPopupUrl) {
        const delayMs = Math.max(1, Number(campaignData.delayPopupDelaySeconds) || 15) * 1000;
        delayTimer = window.setTimeout(() => {
          openPopup(delayOverlay, delayFrame, campaignData.delayPopupUrl);
        }, delayMs);
      }

      delayCloseBtn?.addEventListener('click', () => {
        closePopup(delayOverlay, delayFrame, campaignData.delayPopupCloseUrl);
      });

      let exitTriggered = false;
      const exitHandler = () => {
        if (exitTriggered || !campaignData.exitPopupUrl) return;
        exitTriggered = true;
        openPopup(exitOverlay, exitFrame, campaignData.exitPopupUrl);
      };

      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          exitHandler();
        }
      });

      window.addEventListener('pagehide', exitHandler);

      exitCloseBtn?.addEventListener('click', () => {
        closePopup(exitOverlay, exitFrame, campaignData.exitPopupCloseUrl);
      });

      window.addEventListener('beforeunload', () => {
        if (delayTimer) {
          window.clearTimeout(delayTimer);
        }
      });
    </script>
  </body>
</html>`;
