# Pawcasso Atelier

AI-powered artistic animal portrait Instagram business.

**Account:** [@pawcasso.atelier](https://instagram.com/pawcasso.atelier)

## Architecture

```
┌─────────────────────────────────────────────────────┐
│                    n8n Orchestrator                  │
│                                                     │
│  ┌──────────┐   ┌──────────┐   ┌───────────────┐  │
│  │ Schedule  │──▶│ Concept  │──▶│ Manus/Nano    │  │
│  │ Trigger   │   │ Generator│   │ Banana ImgGen │  │
│  └──────────┘   └──────────┘   └──────┬────────┘  │
│                                        │           │
│                                        ▼           │
│                               ┌───────────────┐   │
│                               │ Quality Check │   │
│                               │ (iterate if   │   │
│                               │  needed)      │   │
│                               └──────┬────────┘   │
│                                      │             │
│                                      ▼             │
│                               ┌───────────────┐   │
│                               │ Caption Gen   │   │
│                               │ + Hashtags    │   │
│                               └──────┬────────┘   │
│                                      │             │
│                                      ▼             │
│                               ┌───────────────┐   │
│                               │ Review Queue  │──▶ Michael approves
│                               │ (GChat/Email) │   │
│                               └──────┬────────┘   │
│                                      │             │
│                                      ▼             │
│                               ┌───────────────┐   │
│                               │ Post to       │   │
│                               │ Instagram API │   │
│                               └───────────────┘   │
└─────────────────────────────────────────────────────┘
```

## Tech Stack

- **Image Generation:** Manus API + Nano Banana
- **Orchestration:** n8n (self-hosted at n8n.aws.metafb.cloud)
- **Posting:** Instagram Graph API
- **Review:** GChat/Email notifications

## Setup

See [docs/instagram-setup.md](docs/instagram-setup.md) for Instagram API setup instructions.

## Content Strategy

See [docs/content-strategy.md](docs/content-strategy.md) for the full content plan.
