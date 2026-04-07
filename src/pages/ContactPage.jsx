import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { Box, Button, Card, CardContent, Grid, Stack, Typography } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import { PageHeader } from '../components/PageHeader';
import { SectionHeading } from '../components/SectionHeading';
import { contactPage } from '../data';

export function ContactPage() {
  return (
    <Stack spacing={5}>
      <PageHeader
        eyebrow="Contact"
        title={contactPage.title}
        intro={contactPage.intro}
        titleWidth="10ch"
        introWidth={620}
      />

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
