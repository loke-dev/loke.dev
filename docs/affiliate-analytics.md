# Affiliate click analytics

Outbound links use `/go/:partner?from=:placement`. Each valid redirect writes
one aggregate event to the Cloudflare Analytics Engine dataset
`affiliate_clicks` and also emits a structured Worker log.

No cookie, IP address, user identifier, or browser fingerprint is written.

## Dataset schema

Keep the ordered Analytics Engine columns stable:

| Column    | Meaning                                                   |
| --------- | --------------------------------------------------------- |
| `index1`  | Partner slug, also used as the sampling key               |
| `blob1`   | Schema version, currently `v1`                            |
| `blob2`   | Partner slug                                              |
| `blob3`   | Link placement from the cleaned `from` query parameter    |
| `blob4`   | Same-site referrer path, `external`, `none`, or `invalid` |
| `blob5`   | Link type: `direct` or `affiliate`                        |
| `blob6`   | Experience label from the partner registry                |
| `double1` | Event count, currently `1`                                |

The binding creates the dataset when the first event is written.

## Useful SQL

Cloudflare sampling-aware click totals for the last 30 days:

```sql
SELECT
  blob2 AS partner,
  blob3 AS placement,
  blob5 AS link_type,
  SUM(_sample_interval * double1) AS clicks
FROM affiliate_clicks
WHERE timestamp > NOW() - INTERVAL '30' DAY
  AND blob1 = 'v1'
GROUP BY partner, placement, link_type
ORDER BY clicks DESC
```

Daily totals:

```sql
SELECT
  toDate(timestamp) AS day,
  blob2 AS partner,
  SUM(_sample_interval * double1) AS clicks
FROM affiliate_clicks
WHERE timestamp > NOW() - INTERVAL '30' DAY
  AND blob1 = 'v1'
GROUP BY day, partner
ORDER BY day DESC, clicks DESC
```

Querying the dataset requires a Cloudflare API token with
`Account Analytics: Read`. Store that token as a secret; never commit it.
