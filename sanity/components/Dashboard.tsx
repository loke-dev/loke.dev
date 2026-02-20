import { useEffect, useState } from 'react'
import { useClient } from 'sanity'
import styled from 'styled-components'

const Container = styled.div`
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
  min-height: 100vh;
`

const Header = styled.div`
  margin-bottom: 2rem;
`

const Title = styled.h1`
  font-size: 2rem;
  font-weight: 700;
  margin: 0 0 0.5rem 0;
`

const Subtitle = styled.p`
  color: #6b7280;
  margin: 0;
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  margin-bottom: 2rem;

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div<{ $accent?: string }>`
  background: var(--card-bg-color);
  border: 1px solid var(--card-border-color);
  border-radius: 12px;
  padding: 1.5rem;
  position: relative;
  overflow: hidden;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: ${(props) => props.$accent || '#3b82f6'};
  }
`

const StatIcon = styled.div`
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
`

const StatValue = styled.div`
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--card-fg-color);
  line-height: 1;
`

const StatLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  margin-top: 0.5rem;
`

const StatChange = styled.span<{ $positive?: boolean }>`
  font-size: 0.75rem;
  color: ${(props) => (props.$positive ? '#10b981' : '#6b7280')};
  margin-left: 0.5rem;
`

const TwoColumnGrid = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Card = styled.div`
  background: var(--card-bg-color);
  border: 1px solid var(--card-border-color);
  border-radius: 12px;
  padding: 1.5rem;
`

const CardTitle = styled.h2`
  font-size: 1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const ChartContainer = styled.div`
  height: 200px;
  display: flex;
  align-items: flex-end;
  gap: 8px;
  padding-top: 1rem;
`

const Bar = styled.div<{ $height: number; $color: string }>`
  flex: 1;
  height: ${(props) => props.$height}%;
  background: ${(props) => props.$color};
  border-radius: 4px 4px 0 0;
  min-height: 4px;
  transition: height 0.3s ease;
  position: relative;

  &:hover {
    opacity: 0.8;
  }
`

const BarLabel = styled.div`
  position: absolute;
  bottom: -24px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.625rem;
  color: #6b7280;
  white-space: nowrap;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
`

const ListItem = styled.a`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--card-border-color);
  text-decoration: none;
  color: inherit;
  transition: opacity 0.15s;

  &:last-child {
    border-bottom: none;
  }

  &:hover {
    opacity: 0.7;
  }
`

const ItemTitle = styled.span`
  font-weight: 500;
  font-size: 0.875rem;
`

const ItemMeta = styled.span`
  font-size: 0.75rem;
  color: #6b7280;
`

const Tag = styled.span<{ $color?: string }>`
  display: inline-block;
  background: ${(props) => props.$color || '#3b82f6'}20;
  color: ${(props) => props.$color || '#3b82f6'};
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
  font-size: 0.625rem;
  margin-right: 0.5rem;
  font-weight: 500;
`

const EmptyState = styled.div`
  padding: 2rem;
  text-align: center;
  color: #6b7280;
  font-size: 0.875rem;
`

const TagCloud = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`

const TagItem = styled.div<{ $size: number }>`
  background: var(--card-bg2-color, #1f2937);
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: ${(props) => 0.7 + props.$size * 0.15}rem;
  color: var(--card-fg-color);
  display: flex;
  align-items: center;
  gap: 0.5rem;
`

const TagCount = styled.span`
  background: #3b82f6;
  color: white;
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.625rem;
  font-weight: 600;
`

const ActivityItem = styled.div`
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--card-border-color);

  &:last-child {
    border-bottom: none;
  }
`

const ActivityDot = styled.div<{ $color: string }>`
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: ${(props) => props.$color};
  margin-top: 6px;
  flex-shrink: 0;
`

const ActivityContent = styled.div`
  flex: 1;
`

const ActivityTitle = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`

const ActivityTime = styled.div`
  font-size: 0.75rem;
  color: #6b7280;
`

const QuickActions = styled.div`
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
`

const ActionButton = styled.a`
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 1rem;
  background: var(--card-bg2-color, #1f2937);
  border-radius: 8px;
  text-decoration: none;
  color: inherit;
  transition: all 0.15s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  }
`

const ActionIcon = styled.span`
  font-size: 1.5rem;
`

const ActionText = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
`

const SeshatSection = styled(Card)`
  margin-bottom: 2rem;
  background: linear-gradient(135deg, var(--card-bg-color) 0%, #1e3a5f 100%);
  border-color: #3b82f6;
`

const SeshatForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`

const InputGroup = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
`

const Label = styled.label`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--card-fg-color);
`

const Input = styled.input`
  padding: 0.75rem;
  border: 1px solid var(--card-border-color);
  border-radius: 6px;
  background: var(--card-bg2-color, #1f2937);
  color: var(--card-fg-color);
  font-size: 0.875rem;

  &:focus {
    outline: none;
    border-color: #3b82f6;
  }

  &::placeholder {
    color: #6b7280;
  }
`

const Button = styled.button<{ $variant?: 'primary' | 'secondary' }>`
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  background: ${(props) =>
    props.$variant === 'primary' ? '#3b82f6' : '#4b5563'};
  color: white;

  &:hover {
    background: ${(props) =>
      props.$variant === 'primary' ? '#2563eb' : '#374151'};
  }

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

const StatusMessage = styled.div<{ $type: 'success' | 'error' | 'info' }>`
  padding: 0.75rem;
  border-radius: 6px;
  font-size: 0.875rem;
  background: ${(props) => {
    if (props.$type === 'success') return '#10b98120'
    if (props.$type === 'error') return '#ef444420'
    return '#3b82f620'
  }};
  color: ${(props) => {
    if (props.$type === 'success') return '#10b981'
    if (props.$type === 'error') return '#ef4444'
    return '#3b82f6'
  }};
  border: 1px solid
    ${(props) => {
      if (props.$type === 'success') return '#10b981'
      if (props.$type === 'error') return '#ef4444'
      return '#3b82f6'
    }};
`

interface Post {
  _id: string
  _createdAt: string
  _updatedAt: string
  title: string
  slug: { current: string }
  date: string
  tag: string
}

interface Project {
  _id: string
  _createdAt: string
  title: string
  slug: { current: string }
  year: number
}

interface MonthlyData {
  month: string
  count: number
}

interface TagData {
  tag: string
  count: number
}

interface Stats {
  totalPosts: number
  totalProjects: number
  postsThisYear: number
  postsLastYear: number
  totalWords: number
  featuredProjects: number
}

const MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
]
const TAG_COLORS: Record<string, string> = {
  technology: '#3b82f6',
  design: '#ec4899',
  tutorial: '#10b981',
  thoughts: '#f59e0b',
  default: '#6366f1',
}

export function Dashboard() {
  const client = useClient({ apiVersion: '2024-01-01' })
  const [stats, setStats] = useState<Stats>({
    totalPosts: 0,
    totalProjects: 0,
    postsThisYear: 0,
    postsLastYear: 0,
    totalWords: 0,
    featuredProjects: 0,
  })
  const [recentPosts, setRecentPosts] = useState<Post[]>([])
  const [recentActivity, setRecentActivity] = useState<(Post | Project)[]>([])
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([])
  const [tagData, setTagData] = useState<TagData[]>([])
  const [loading, setLoading] = useState(true)
  const [seshatTopic, setSeshatTopic] = useState('')
  const [seshatLoading, setSeshatLoading] = useState(false)
  const [seshatStatus, setSeshatStatus] = useState<{
    type: 'success' | 'error' | 'info'
    message: string
  } | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const currentYear = new Date().getFullYear()
        const lastYear = currentYear - 1

        const [
          postsCount,
          projectsCount,
          postsThisYearCount,
          postsLastYearCount,
          featuredCount,
          posts,
          allPosts,
          allProjects,
          tags,
        ] = await Promise.all([
          client.fetch<number>(`count(*[_type == "post"])`),
          client.fetch<number>(`count(*[_type == "project"])`),
          client.fetch<number>(
            `count(*[_type == "post" && date >= "${currentYear}-01-01"])`
          ),
          client.fetch<number>(
            `count(*[_type == "post" && date >= "${lastYear}-01-01" && date < "${currentYear}-01-01"])`
          ),
          client.fetch<number>(
            `count(*[_type == "project" && featured == true])`
          ),
          client.fetch<Post[]>(
            `*[_type == "post"] | order(date desc)[0...5] { _id, _createdAt, _updatedAt, title, slug, date, tag }`
          ),
          client.fetch<Post[]>(
            `*[_type == "post"] | order(_updatedAt desc)[0...10] { _id, _createdAt, _updatedAt, title, slug, date, tag }`
          ),
          client.fetch<Project[]>(
            `*[_type == "project"] | order(_createdAt desc)[0...5] { _id, _createdAt, title, slug, year }`
          ),
          client.fetch<TagData[]>(
            `*[_type == "post" && defined(tag)] { tag } | order(tag) { "tag": tag, "count": count(*[_type == "post" && tag == ^.tag]) }`
          ),
        ])

        // Deduplicate tags
        const uniqueTags = tags.reduce((acc: TagData[], curr) => {
          if (!acc.find((t) => t.tag === curr.tag)) {
            acc.push(curr)
          }
          return acc
        }, [])

        // Calculate monthly data for the current year
        const monthly: MonthlyData[] = MONTHS.map((month, index) => {
          const monthNum = String(index + 1).padStart(2, '0')
          const startDate = `${currentYear}-${monthNum}-01`
          const endMonth =
            index === 11
              ? `${currentYear + 1}-01-01`
              : `${currentYear}-${String(index + 2).padStart(2, '0')}-01`
          const count = allPosts.filter(
            (p) => p.date >= startDate && p.date < endMonth
          ).length
          return { month, count }
        })

        // Combine recent activity
        const activity = [...allPosts.slice(0, 5), ...allProjects.slice(0, 3)]
          .sort(
            (a, b) =>
              new Date(b._createdAt).getTime() -
              new Date(a._createdAt).getTime()
          )
          .slice(0, 6)

        setStats({
          totalPosts: postsCount,
          totalProjects: projectsCount,
          postsThisYear: postsThisYearCount,
          postsLastYear: postsLastYearCount,
          totalWords: postsCount * 800, // Estimate
          featuredProjects: featuredCount,
        })
        setRecentPosts(posts)
        setRecentActivity(activity)
        setMonthlyData(monthly)
        setTagData(uniqueTags.sort((a, b) => b.count - a.count).slice(0, 6))
      } catch (error) {
        console.error('Error fetching dashboard data:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [client])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatRelativeTime = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const days = Math.floor(diff / (1000 * 60 * 60 * 24))

    if (days === 0) return 'Today'
    if (days === 1) return 'Yesterday'
    if (days < 7) return `${days} days ago`
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`
    return formatDate(dateString)
  }

  const getTagColor = (tag: string) => {
    return TAG_COLORS[tag.toLowerCase()] || TAG_COLORS.default
  }

  const handleSeshatSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!seshatTopic.trim()) return

    setSeshatLoading(true)
    setSeshatStatus({
      type: 'info',
      message: 'Starting background generation...',
    })

    try {
      const apiUrl = window.location.origin + '/api/seshat/trigger'
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ topic: seshatTopic }),
      })

      const data = await response.json()

      if (response.ok && data.success) {
        setSeshatStatus({
          type: 'success',
          message:
            'Generation started in background! Check GitHub Actions for progress. The post will appear when complete.',
        })
        setSeshatTopic('')
      } else {
        setSeshatStatus({
          type: 'error',
          message: data.error || 'Failed to start generation',
        })
      }
    } catch {
      setSeshatStatus({
        type: 'error',
        message: 'Failed to connect to the server',
      })
    } finally {
      setSeshatLoading(false)
    }
  }

  const maxMonthlyCount = Math.max(...monthlyData.map((d) => d.count), 1)

  if (loading) {
    return (
      <Container>
        <Header>
          <Title>📊 Dashboard</Title>
          <Subtitle>Loading your content stats...</Subtitle>
        </Header>
      </Container>
    )
  }

  const yearOverYearChange =
    stats.postsLastYear > 0
      ? Math.round(
          ((stats.postsThisYear - stats.postsLastYear) / stats.postsLastYear) *
            100
        )
      : 0

  return (
    <Container>
      <Header>
        <Title>📊 Dashboard</Title>
        <Subtitle>Welcome back! Here&apos;s your content overview.</Subtitle>
      </Header>

      <SeshatSection>
        <CardTitle>✦ Seshat Scribe - AI Blog Generator</CardTitle>
        <SeshatForm onSubmit={handleSeshatSubmit}>
          <InputGroup>
            <Label htmlFor="seshat-topic">Custom Topic</Label>
            <Input
              id="seshat-topic"
              type="text"
              placeholder="e.g., Building a GraphQL API with Node.js"
              value={seshatTopic}
              onChange={(e) => setSeshatTopic(e.target.value)}
              disabled={seshatLoading}
            />
          </InputGroup>
          {seshatStatus && (
            <StatusMessage $type={seshatStatus.type}>
              {seshatStatus.message}
            </StatusMessage>
          )}
          <Button
            type="submit"
            $variant="primary"
            disabled={seshatLoading || !seshatTopic.trim()}
          >
            {seshatLoading ? '⏳ Generating...' : '✦ Generate Blog Post'}
          </Button>
        </SeshatForm>
      </SeshatSection>

      <Grid>
        <StatCard $accent="#3b82f6">
          <StatIcon>📝</StatIcon>
          <StatValue>{stats.totalPosts}</StatValue>
          <StatLabel>Total Posts</StatLabel>
        </StatCard>
        <StatCard $accent="#10b981">
          <StatIcon>🚀</StatIcon>
          <StatValue>{stats.totalProjects}</StatValue>
          <StatLabel>
            Projects
            {stats.featuredProjects > 0 && (
              <StatChange $positive>
                {' '}
                • {stats.featuredProjects} featured
              </StatChange>
            )}
          </StatLabel>
        </StatCard>
        <StatCard $accent="#f59e0b">
          <StatIcon>📅</StatIcon>
          <StatValue>{stats.postsThisYear}</StatValue>
          <StatLabel>
            Posts This Year
            {yearOverYearChange !== 0 && (
              <StatChange $positive={yearOverYearChange > 0}>
                {yearOverYearChange > 0 ? '↑' : '↓'}{' '}
                {Math.abs(yearOverYearChange)}% vs last year
              </StatChange>
            )}
          </StatLabel>
        </StatCard>
        <StatCard $accent="#ec4899">
          <StatIcon>✍️</StatIcon>
          <StatValue>~{(stats.totalWords / 1000).toFixed(0)}k</StatValue>
          <StatLabel>Words Written (est.)</StatLabel>
        </StatCard>
      </Grid>

      <TwoColumnGrid>
        <Card>
          <CardTitle>📈 Posts per Month ({new Date().getFullYear()})</CardTitle>
          <ChartContainer>
            {monthlyData.map((data, index) => (
              <Bar
                key={data.month}
                $height={(data.count / maxMonthlyCount) * 100}
                $color={index === new Date().getMonth() ? '#3b82f6' : '#4b5563'}
                title={`${data.month}: ${data.count} posts`}
              >
                <BarLabel>{data.month}</BarLabel>
              </Bar>
            ))}
          </ChartContainer>
        </Card>

        <Card>
          <CardTitle>⚡ Quick Actions</CardTitle>
          <QuickActions>
            <ActionButton href="/studio/structure/posts;__new__">
              <ActionIcon>📝</ActionIcon>
              <ActionText>New Post</ActionText>
            </ActionButton>
            <ActionButton href="/studio/structure/projects;__new__">
              <ActionIcon>🚀</ActionIcon>
              <ActionText>New Project</ActionText>
            </ActionButton>
            <ActionButton href="/studio/structure/posts">
              <ActionIcon>📚</ActionIcon>
              <ActionText>All Posts</ActionText>
            </ActionButton>
            <ActionButton href="/studio/vision">
              <ActionIcon>🔍</ActionIcon>
              <ActionText>GROQ Query</ActionText>
            </ActionButton>
          </QuickActions>
        </Card>
      </TwoColumnGrid>

      <TwoColumnGrid>
        <Card>
          <CardTitle>📝 Recent Posts</CardTitle>
          <List>
            {recentPosts.length > 0 ? (
              recentPosts.map((post) => (
                <ListItem
                  key={post._id}
                  href={`/studio/structure/posts;${post._id}`}
                >
                  <div>
                    {post.tag && (
                      <Tag $color={getTagColor(post.tag)}>{post.tag}</Tag>
                    )}
                    <ItemTitle>{post.title}</ItemTitle>
                  </div>
                  <ItemMeta>{formatDate(post.date)}</ItemMeta>
                </ListItem>
              ))
            ) : (
              <EmptyState>No posts yet. Create your first post!</EmptyState>
            )}
          </List>
        </Card>

        <Card>
          <CardTitle>🏷️ Tags</CardTitle>
          {tagData.length > 0 ? (
            <TagCloud>
              {tagData.map((tag, index) => (
                <TagItem key={tag.tag} $size={Math.max(1, 3 - index)}>
                  {tag.tag}
                  <TagCount>{tag.count}</TagCount>
                </TagItem>
              ))}
            </TagCloud>
          ) : (
            <EmptyState>No tags yet</EmptyState>
          )}
        </Card>
      </TwoColumnGrid>

      <Card>
        <CardTitle>🕐 Recent Activity</CardTitle>
        {recentActivity.length > 0 ? (
          recentActivity.map((item) => (
            <ActivityItem key={item._id}>
              <ActivityDot $color={'tag' in item ? '#3b82f6' : '#10b981'} />
              <ActivityContent>
                <ActivityTitle>
                  {'tag' in item ? '📝' : '🚀'} {item.title}
                </ActivityTitle>
                <ActivityTime>
                  {'tag' in item ? 'Post' : 'Project'} •{' '}
                  {formatRelativeTime(item._createdAt)}
                </ActivityTime>
              </ActivityContent>
            </ActivityItem>
          ))
        ) : (
          <EmptyState>No recent activity</EmptyState>
        )}
      </Card>
    </Container>
  )
}
