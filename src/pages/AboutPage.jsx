import { Box, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { aboutPage } from '../data';

export function AboutPage() {
  return (
    <Stack spacing={5}>
      <PageHeader
        eyebrow="About"
        title={aboutPage.title}
        intro={aboutPage.intro}
        titleWidth="11ch"
      />

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
