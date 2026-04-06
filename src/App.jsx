import EastIcon from '@mui/icons-material/East';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import {
  Alert,
  Box,
  Button,
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Chip,
  Grid,
  Link as MuiLink,
  Stack,
  Typography,
} from '@mui/material';
import { Link as RouterLink, Navigate, Route, Routes, useParams } from 'react-router-dom';
import { PostCard } from './components/PostCard';
import { SiteLayout } from './components/SiteLayout';
import {
  aboutPage,
  contactPage,
  featuredPostSlug,
  getPostBySlug,
  posts,
} from './data/siteData';

const featuredPost = getPostBySlug(featuredPostSlug);

function SectionHeading({ eyebrow, title, copy }) {
  return (
    <Stack
      direction={{ xs: 'column', md: 'row' }}
      justifyContent="space-between"
      alignItems={{ xs: 'flex-start', md: 'flex-end' }}
      spacing={2}
      sx={{ mb: 3 }}
    >
      <Box>
        <Typography variant="overline">{eyebrow}</Typography>
        <Typography variant="h2">{title}</Typography>
      </Box>
      {copy ? (
        <Typography color="text.secondary" sx={{ maxWidth: 420 }}>
          {copy}
        </Typography>
      ) : null}
    </Stack>
  );
}

function HomePage() {
  const recentPosts = posts.filter((post) => post.slug !== featuredPostSlug).slice(0, 3);

  return (
    <Stack spacing={6}>
      <Box sx={{ pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline">Blog</Typography>
        <Typography variant="h1" sx={{ maxWidth: '10ch' }}>
          Thoughtful writing on work, systems, and everyday life.
        </Typography>
        <Typography
          color="text.secondary"
          sx={{ maxWidth: 720, mt: 2, fontSize: '1.1rem', lineHeight: 1.85 }}
        >
          A personal blog for practical writing across operations, technology,
          documentation, travel, and other ideas worth keeping in one place.
        </Typography>
        <Stack direction={{ xs: 'column', sm: 'row' }} spacing={1.5} sx={{ mt: 3 }}>
          <Button
            variant="contained"
            component={RouterLink}
            to={`/posts/${featuredPost.slug}`}
          >
            Read Featured Post
          </Button>
          <Button variant="outlined" component={RouterLink} to="/archive">
            View Archive
          </Button>
        </Stack>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Featured"
          title="Start here"
          copy="A selected article that reflects the tone and direction of the site."
        />
        <Card>
          <Grid container>
            <Grid item xs={12} md={4}>
              <CardMedia
                component="img"
                image={featuredPost.heroImage}
                alt={featuredPost.heroAlt}
                sx={{ height: { xs: 280, md: '100%' }, bgcolor: '#e9eeea' }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <CardContent sx={{ p: 4 }}>
                <Typography variant="overline">{featuredPost.category}</Typography>
                <Typography variant="h2" sx={{ mb: 2 }}>
                  {featuredPost.title}
                </Typography>
                <Typography color="text.secondary" sx={{ maxWidth: 640 }}>
                  {featuredPost.summary}
                </Typography>
                <Stack direction="row" spacing={1} sx={{ mt: 2, mb: 3 }}>
                  <Typography variant="body2" color="text.secondary">
                    {featuredPost.date}
                  </Typography>
                  <Box component="span" sx={{ color: 'text.secondary' }}>
                    ·
                  </Box>
                  <Typography variant="body2" color="text.secondary">
                    {featuredPost.readTime}
                  </Typography>
                </Stack>
                <Button
                  component={RouterLink}
                  to={`/posts/${featuredPost.slug}`}
                  endIcon={<EastIcon />}
                >
                  Read article
                </Button>
              </CardContent>
            </Grid>
          </Grid>
        </Card>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Recent Writing"
          title="Latest posts"
          copy="Recent articles across operations, support, and documentation."
        />
        <Stack spacing={2}>
          {recentPosts.map((post) => (
            <PostCard key={post.slug} post={post} horizontal />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

function AboutPage() {
  return (
    <Stack spacing={5}>
      <Box sx={{ pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline">About</Typography>
        <Typography variant="h1" sx={{ maxWidth: '11ch' }}>
          {aboutPage.title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 2, fontSize: '1.08rem', lineHeight: 1.85 }}>
          {aboutPage.intro}
        </Typography>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Why this site exists"
          title={aboutPage.sectionTitle}
          copy={aboutPage.sectionCopy}
        />
        <Stack spacing={2} sx={{ maxWidth: 720 }}>
          {aboutPage.paragraphs.map((paragraph) => (
            <Typography key={paragraph} color="text.secondary">
              {paragraph}
            </Typography>
          ))}
        </Stack>
        <Grid container spacing={2} sx={{ mt: 2 }}>
          {aboutPage.principles.map((principle) => (
            <Grid item xs={12} md={4} key={principle.title}>
              <Card>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h3" gutterBottom>
                    {principle.title}
                  </Typography>
                  <Typography color="text.secondary">
                    {principle.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Stack>
  );
}

function ArchivePage() {
  return (
    <Stack spacing={5}>
      <Box sx={{ pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline">Archive</Typography>
        <Typography variant="h1" sx={{ maxWidth: '9ch' }}>
          All writing in one place.
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 620, mt: 2, fontSize: '1.08rem', lineHeight: 1.85 }}>
          A simple archive page keeps the site easy to browse as the number of
          posts grows.
        </Typography>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="All posts"
          title="Browse by title and topic"
          copy="Every article in one running list, with enough context to scan quickly and choose where to start."
        />
        <Stack spacing={2}>
          {posts.map((post) => (
            <PostCard key={post.slug} post={post} horizontal />
          ))}
        </Stack>
      </Box>
    </Stack>
  );
}

function ContactPage() {
  return (
    <Stack spacing={5}>
      <Box sx={{ pb: 5, borderBottom: '1px solid', borderColor: 'divider' }}>
        <Typography variant="overline">Contact</Typography>
        <Typography variant="h1" sx={{ maxWidth: '10ch' }}>
          {contactPage.title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 620, mt: 2, fontSize: '1.08rem', lineHeight: 1.85 }}>
          {contactPage.intro}
        </Typography>
      </Box>

      <Box>
        <SectionHeading
          eyebrow="Contact options"
          title={contactPage.sectionTitle}
          copy={contactPage.sectionCopy}
        />
        <Grid container spacing={2}>
          {contactPage.options.map((option) => {
            const external = option.href.startsWith('http');

            return (
              <Grid item xs={12} md={4} key={option.title}>
                <Card sx={{ height: '100%' }}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="overline">{option.label}</Typography>
                    <Typography variant="h3" gutterBottom>
                      {option.title}
                    </Typography>
                    <Typography color="text.secondary" sx={{ mb: 2 }}>
                      {option.description}
                    </Typography>
                    <Button
                      variant="outlined"
                      component={external ? 'a' : RouterLink}
                      href={external ? option.href : undefined}
                      to={external ? undefined : option.href}
                      target={external ? '_blank' : undefined}
                      rel={external ? 'noreferrer' : undefined}
                      endIcon={external ? <OpenInNewIcon fontSize="small" /> : undefined}
                    >
                      {option.linkLabel}
                    </Button>
                  </CardContent>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Stack>
  );
}

function PostPage() {
  const { slug } = useParams();
  const postIndex = posts.findIndex((item) => item.slug === slug);
  const post = postIndex >= 0 ? posts[postIndex] : undefined;

  if (!post) {
    return <Navigate to="/" replace />;
  }

  const previousPost = postIndex > 0 ? posts[postIndex - 1] : undefined;
  const nextPost = postIndex < posts.length - 1 ? posts[postIndex + 1] : undefined;

  return (
    <Stack spacing={4}>
      <Card sx={{ p: { xs: 3, md: 4 } }}>
        <MuiLink component={RouterLink} to="/" color="text.secondary" sx={{ mb: 2, display: 'inline-block' }}>
          Back to homepage
        </MuiLink>
        <Typography variant="overline">{post.category}</Typography>
        <Typography variant="h1" sx={{ maxWidth: '12ch' }}>
          {post.title}
        </Typography>
        <Typography color="text.secondary" sx={{ maxWidth: 720, mt: 2, fontSize: '1.08rem', lineHeight: 1.85 }}>
          {post.intro}
        </Typography>
        <Stack direction="row" spacing={1} sx={{ mt: 2 }}>
          <Chip label={post.date} variant="outlined" size="small" />
          <Chip label={post.readTime} variant="outlined" size="small" />
        </Stack>

        <Box sx={{ mt: 3 }}>
          <Box
            component="img"
            src={post.heroImage}
            alt={post.heroAlt}
            sx={{
              width: '100%',
              borderRadius: 2,
              border: '1px solid',
              borderColor: 'divider',
              display: 'block',
            }}
          />
          <Typography color="text.secondary" variant="body2" sx={{ mt: 1 }}>
            Photo:{' '}
            <MuiLink href={post.photoCreditUrl} target="_blank" rel="noreferrer">
              {post.photoCreditLabel}
            </MuiLink>
          </Typography>
        </Box>

        <Stack spacing={3} sx={{ mt: 4, maxWidth: 720 }}>
          {post.sections.map((section) => (
            <Box key={section.heading || section.paragraphs[0]}>
              {section.heading ? (
                <Typography variant="h2" sx={{ mb: 1.5 }}>
                  {section.heading}
                </Typography>
              ) : null}
              <Stack spacing={2}>
                {section.paragraphs.map((paragraph) => (
                  <Typography key={paragraph}>{paragraph}</Typography>
                ))}
              </Stack>
            </Box>
          ))}
        </Stack>
      </Card>

      <Box>
        <SectionHeading eyebrow="Post navigation" title="Continue reading" />
        <Grid container spacing={2}>
          {previousPost ? (
            <Grid item xs={12} md={6}>
              <Card>
                <CardActionArea component={RouterLink} to={`/posts/${previousPost.slug}`}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="overline">Previous post</Typography>
                    <Typography variant="h3">{previousPost.title}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ) : null}
          {nextPost ? (
            <Grid item xs={12} md={6}>
              <Card>
                <CardActionArea component={RouterLink} to={`/posts/${nextPost.slug}`}>
                  <CardContent sx={{ p: 3 }}>
                    <Typography variant="overline">Next post</Typography>
                    <Typography variant="h3">{nextPost.title}</Typography>
                  </CardContent>
                </CardActionArea>
              </Card>
            </Grid>
          ) : null}
        </Grid>
      </Box>

      <Box>
        <SectionHeading eyebrow="More writing" title="Related posts" />
        <Grid container spacing={2}>
          {post.related.map((item) => {
            const relatedPost = getPostBySlug(item.slug);
            if (!relatedPost) return null;

            return (
              <Grid item xs={12} md={6} key={item.slug}>
                <Card>
                  <CardActionArea component={RouterLink} to={`/posts/${item.slug}`}>
                    <CardContent sx={{ p: 3 }}>
                      <Typography variant="h3" gutterBottom>
                        {relatedPost.title}
                      </Typography>
                      <Typography color="text.secondary">{item.blurb}</Typography>
                    </CardContent>
                  </CardActionArea>
                </Card>
              </Grid>
            );
          })}
        </Grid>
      </Box>
    </Stack>
  );
}

function NotFoundPage() {
  return (
    <Alert severity="info">
      The page you requested could not be found.
    </Alert>
  );
}

export default function App() {
  return (
    <SiteLayout>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/archive" element={<ArchivePage />} />
        <Route path="/contact" element={<ContactPage />} />
        <Route path="/posts/:slug" element={<PostPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </SiteLayout>
  );
}
