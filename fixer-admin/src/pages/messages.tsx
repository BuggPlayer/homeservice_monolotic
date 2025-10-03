import React, { useState, useEffect } from 'react'
import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Card,
  CardContent,
  useTheme,
  useMediaQuery,
  Fade,
  Slide,
  Chip,
  IconButton,
  Tooltip,
  alpha,
  Avatar,
  Badge,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Message,
  Chat,
  Notifications,
  Email,
  Phone,
  VideoCall,
  AttachFile,
  EmojiEmotions,
  Search,
  FilterList,
  Archive,
  Delete,
  MarkAsUnread,
  Reply,
  Forward,
  Schedule,
  PriorityHigh,
  Group,
  PersonAdd,
  Settings,
  MoreVert,
  Inbox,
  Send,
  Drafts,
  Report,
  Star,
  StarBorder,
  CheckCircle,
  ScheduleSend,
  AutoAwesome,
  SmartToy,
  Translate,
  VoiceChat,
  ScreenShare,
  RecordVoiceOver,
} from '@mui/icons-material'
import { PageHeader } from '../components/common/PageHeader'
import { EmptyState } from '../components/common/EmptyState'
import { CustomAlert } from '../components/ui/Feedback'

interface MessageFeature {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  color: string
  category: 'communication' | 'automation' | 'analytics' | 'integration'
}

interface MessageType {
  id: string
  name: string
  icon: React.ReactNode
  description: string
  color: string
  count: number
}

interface ConversationPreview {
  id: string
  name: string
  avatar: string
  lastMessage: string
  timestamp: string
  unread: number
  status: 'online' | 'offline' | 'away'
  priority: 'high' | 'medium' | 'low'
}

export function Messages() {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const isTablet = useMediaQuery(theme.breakpoints.down('lg'))
  
  const [showContent, setShowContent] = useState(false)
  const [selectedFeature, setSelectedFeature] = useState<string | null>(null)

  useEffect(() => {
    const timer = setTimeout(() => setShowContent(true), 300)
    return () => clearTimeout(timer)
  }, [])

  const messageTypes: MessageType[] = [
    {
      id: 'inbox',
      name: 'Inbox',
      icon: <Inbox />,
      description: 'All incoming messages',
      color: theme.palette.primary.main,
      count: 24,
    },
    {
      id: 'sent',
      name: 'Sent',
      icon: <Send />,
      description: 'Messages you sent',
      color: theme.palette.success.main,
      count: 156,
    },
    {
      id: 'drafts',
      name: 'Drafts',
      icon: <Drafts />,
      description: 'Unsent messages',
      color: theme.palette.warning.main,
      count: 8,
    },
    {
      id: 'spam',
      name: 'Spam',
      icon: <Report />,
      description: 'Filtered messages',
      color: theme.palette.error.main,
      count: 3,
    },
  ]

  const upcomingFeatures: MessageFeature[] = [
    {
      id: 'real-time-chat',
      title: 'Real-Time Chat',
      description: 'Instant messaging with typing indicators, read receipts, and message status',
      icon: <Chat />,
      color: theme.palette.primary.main,
      category: 'communication',
    },
    {
      id: 'video-calls',
      title: 'Video & Voice Calls',
      description: 'Integrated video calling with screen sharing and recording capabilities',
      icon: <VideoCall />,
      color: theme.palette.info.main,
      category: 'communication',
    },
    {
      id: 'ai-assistant',
      title: 'AI Message Assistant',
      description: 'Smart reply suggestions, auto-translation, and intelligent message categorization',
      icon: <SmartToy />,
      color: theme.palette.secondary.main,
      category: 'automation',
    },
    {
      id: 'message-analytics',
      title: 'Message Analytics',
      description: 'Track response times, engagement metrics, and communication patterns',
      icon: <AutoAwesome />,
      color: theme.palette.success.main,
      category: 'analytics',
    },
    {
      id: 'bulk-messaging',
      title: 'Bulk Messaging',
      description: 'Send personalized messages to multiple recipients with scheduling options',
      icon: <ScheduleSend />,
      color: theme.palette.warning.main,
      category: 'automation',
    },
    {
      id: 'integrations',
      title: 'Third-Party Integrations',
      description: 'Connect with WhatsApp, SMS, email, and other communication platforms',
      icon: <Group />,
      color: theme.palette.error.main,
      category: 'integration',
    },
  ]

  const conversationPreviews: ConversationPreview[] = [
    {
      id: '1',
      name: 'John Smith',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
      lastMessage: 'Thanks for the quick response!',
      timestamp: '2 min ago',
      unread: 0,
      status: 'online',
      priority: 'medium',
    },
    {
      id: '2',
      name: 'Sarah Johnson',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150',
      lastMessage: 'Can we schedule a call for tomorrow?',
      timestamp: '15 min ago',
      unread: 2,
      status: 'away',
      priority: 'high',
    },
    {
      id: '3',
      name: 'Mike Wilson',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
      lastMessage: 'The project is looking great!',
      timestamp: '1 hour ago',
      unread: 0,
      status: 'offline',
      priority: 'low',
    },
  ]

  const handleFeatureSelect = (featureId: string) => {
    setSelectedFeature(selectedFeature === featureId ? null : featureId)
  }

  const handleGetNotified = () => {
    console.log('Get notified for messages feature')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return theme.palette.success.main
      case 'away': return theme.palette.warning.main
      case 'offline': return theme.palette.grey[400]
      default: return theme.palette.grey[400]
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return theme.palette.error.main
      case 'medium': return theme.palette.warning.main
      case 'low': return theme.palette.success.main
      default: return theme.palette.grey[400]
    }
  }

  return (
    <Box sx={{ flexGrow: 1, p: { xs: 1, sm: 2, md: 3 } }}>
      <Fade in={showContent} timeout={800}>
        <Box>
          <PageHeader
            title="Messages"
            subtitle="Stay connected with customers, providers, and team members through our unified messaging platform"
            action={
              <Button
                variant="contained"
                size="large"
                onClick={handleGetNotified}
                startIcon={<Notifications />}
                sx={{
                  borderRadius: 2,
                  px: 3,
                  py: 1.5,
                  fontSize: { xs: '0.875rem', sm: '1rem' },
                  fontWeight: 600,
                }}
              >
                Get Early Access
              </Button>
            }
          />

          {/* Coming Soon Alert */}
          <Slide direction="down" in={showContent} timeout={1000}>
            <Box sx={{ mb: 4 }}>
              <CustomAlert
                severity="info"
                variant="outlined"
                title="💬 Revolutionary Messaging Platform Coming Soon!"
                sx={{
                  borderRadius: 2,
                  border: `2px solid ${alpha(theme.palette.info.main, 0.2)}`,
                  backgroundColor: alpha(theme.palette.info.main, 0.05),
                  '& .MuiAlert-message': {
                    fontSize: '1rem',
                    fontWeight: 500,
                  },
                }}
              >
                We're building the most advanced messaging system for home service businesses. Get ready for real-time chat, video calls, AI assistance, and seamless integrations!
              </CustomAlert>
            </Box>
          </Slide>

          {/* Message Types Overview */}
          <Slide direction="up" in={showContent} timeout={1200}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'text.primary',
                }}
              >
                Message Management
              </Typography>
              
              <Grid container spacing={3}>
                {messageTypes.map((type, index) => (
                  <Grid size={{ xs: 12, sm: 6, md: 3 }} key={type.id}>
                    <Fade in={showContent} timeout={1400 + index * 100}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: `2px solid transparent`,
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                            border: `2px solid ${type.color}`,
                          },
                        }}
                      >
                        <CardContent sx={{ p: 3, textAlign: 'center' }}>
                          <Box
                            sx={{
                              width: 64,
                              height: 64,
                              borderRadius: '50%',
                              backgroundColor: alpha(type.color, 0.1),
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              mx: 'auto',
                              mb: 2,
                              color: type.color,
                              fontSize: '2rem',
                            }}
                          >
                            {type.icon}
                          </Box>
                          
                          <Typography
                            variant="h6"
                            sx={{
                              fontWeight: 600,
                              mb: 1,
                              fontSize: { xs: '1rem', sm: '1.125rem' },
                            }}
                          >
                            {type.name}
                          </Typography>
                          
                          <Typography
                            variant="body2"
                            color="text.secondary"
                            sx={{ mb: 2, fontSize: '0.875rem' }}
                          >
                            {type.description}
                          </Typography>
                          
                          <Chip
                            label={`${type.count} Messages`}
                            size="small"
                            sx={{
                              backgroundColor: alpha(type.color, 0.1),
                              color: type.color,
                              fontWeight: 600,
                            }}
                          />
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>

          {/* Conversation Preview */}
          <Slide direction="up" in={showContent} timeout={1600}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'text.primary',
                }}
              >
                Live Conversations Preview
              </Typography>
              
              <Paper
                sx={{
                  borderRadius: 2,
                  overflow: 'hidden',
                  border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
                }}
              >
                <Box sx={{ p: 2, backgroundColor: alpha(theme.palette.primary.main, 0.05) }}>
                  <Typography variant="h6" sx={{ fontWeight: 600, color: 'text.primary' }}>
                    Recent Conversations
                  </Typography>
                </Box>
                
                <List sx={{ p: 0 }}>
                  {conversationPreviews.map((conversation, index) => (
                    <Fade in={showContent} timeout={1800 + index * 200} key={conversation.id}>
                      <Box>
                        <ListItem
                          sx={{
                            py: 2,
                            px: 3,
                            '&:hover': {
                              backgroundColor: alpha(theme.palette.primary.main, 0.05),
                            },
                          }}
                        >
                          <ListItemAvatar>
                            <Badge
                              overlap="circular"
                              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
                              badgeContent={
                                <Box
                                  sx={{
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    backgroundColor: getStatusColor(conversation.status),
                                    border: `2px solid ${theme.palette.background.paper}`,
                                  }}
                                />
                              }
                            >
                              <Avatar
                                src={conversation.avatar}
                                alt={conversation.name}
                                sx={{ width: 48, height: 48 }}
                              />
                            </Badge>
                          </ListItemAvatar>
                          
                          <ListItemText
                            primary={
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                                  {conversation.name}
                                </Typography>
                                <Chip
                                  label={conversation.priority}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(getPriorityColor(conversation.priority), 0.1),
                                    color: getPriorityColor(conversation.priority),
                                    fontSize: '0.75rem',
                                    height: 20,
                                  }}
                                />
                              </Box>
                            }
                            secondary={
                              <Box>
                                <Typography
                                  variant="body2"
                                  color="text.secondary"
                                  sx={{ mb: 0.5 }}
                                >
                                  {conversation.lastMessage}
                                </Typography>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                                  <Typography variant="caption" color="text.secondary">
                                    {conversation.timestamp}
                                  </Typography>
                                  {conversation.unread > 0 && (
                                    <Chip
                                      label={conversation.unread}
                                      size="small"
                                      sx={{
                                        backgroundColor: theme.palette.primary.main,
                                        color: 'white',
                                        fontSize: '0.75rem',
                                        height: 18,
                                        minWidth: 18,
                                      }}
                                    />
                                  )}
                                </Box>
                              </Box>
                            }
                          />
                        </ListItem>
                        {index < conversationPreviews.length - 1 && <Divider />}
                      </Box>
                    </Fade>
                  ))}
                </List>
              </Paper>
            </Box>
          </Slide>

          {/* Upcoming Features */}
          <Slide direction="up" in={showContent} timeout={2000}>
            <Box sx={{ mb: 6 }}>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  fontSize: { xs: '1.25rem', sm: '1.5rem', md: '1.75rem' },
                  color: 'text.primary',
                }}
              >
                Powerful Features Coming Soon
              </Typography>
              
              <Grid container spacing={3}>
                {upcomingFeatures.map((feature, index) => (
                  <Grid size={{ xs: 12, md: 6 }} key={feature.id}>
                    <Fade in={showContent} timeout={2200 + index * 100}>
                      <Card
                        sx={{
                          height: '100%',
                          cursor: 'pointer',
                          transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                          border: selectedFeature === feature.id 
                            ? `2px solid ${feature.color}` 
                            : '2px solid transparent',
                          '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: theme.shadows[8],
                            border: `2px solid ${feature.color}`,
                          },
                        }}
                        onClick={() => handleFeatureSelect(feature.id)}
                      >
                        <CardContent sx={{ p: 3 }}>
                          <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
                            <Box
                              sx={{
                                width: 56,
                                height: 56,
                                borderRadius: 2,
                                backgroundColor: alpha(feature.color, 0.1),
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                color: feature.color,
                                fontSize: '1.75rem',
                                flexShrink: 0,
                              }}
                            >
                              {feature.icon}
                            </Box>
                            
                            <Box sx={{ flex: 1 }}>
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                                <Typography
                                  variant="h6"
                                  sx={{
                                    fontWeight: 600,
                                    fontSize: { xs: '1rem', sm: '1.125rem' },
                                  }}
                                >
                                  {feature.title}
                                </Typography>
                                <Chip
                                  label={feature.category}
                                  size="small"
                                  sx={{
                                    backgroundColor: alpha(feature.color, 0.1),
                                    color: feature.color,
                                    fontSize: '0.75rem',
                                    height: 20,
                                  }}
                                />
                              </Box>
                              
                              <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ fontSize: '0.875rem', lineHeight: 1.6 }}
                              >
                                {feature.description}
                              </Typography>
                            </Box>
                          </Box>
                        </CardContent>
                      </Card>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>

          {/* Call to Action */}
          <Slide direction="up" in={showContent} timeout={2400}>
            <Box>
              <EmptyState
                icon={
                  <Box
                    sx={{
                      fontSize: 96,
                      color: theme.palette.primary.main,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Message />
                  </Box>
                }
                title="Ready to Transform Your Communication?"
                description="Join thousands of businesses already using our messaging platform. Get early access to advanced features like AI assistance, video calls, and seamless integrations."
                action={{
                  label: 'Join Waitlist',
                  onClick: handleGetNotified,
                }}
                size="large"
              />
            </Box>
          </Slide>

          {/* Feature Highlights */}
          <Slide direction="up" in={showContent} timeout={2600}>
            <Box sx={{ mt: 6, mb: 4 }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  textAlign: 'center',
                  color: 'text.primary',
                }}
              >
                Why Choose Our Messaging Platform?
              </Typography>
              
              <Grid container spacing={3}>
                {[
                  { icon: <CheckCircle />, text: 'End-to-End Encryption', color: theme.palette.success.main },
                  { icon: <AutoAwesome />, text: 'AI-Powered Features', color: theme.palette.secondary.main },
                  { icon: <Group />, text: 'Team Collaboration', color: theme.palette.info.main },
                  { icon: <Translate />, text: 'Multi-Language Support', color: theme.palette.warning.main },
                ].map((item, index) => (
                  <Grid size={{ xs: 6, md: 3 }} key={index}>
                    <Fade in={showContent} timeout={2800 + index * 100}>
                      <Box sx={{ textAlign: 'center' }}>
                        <Box
                          sx={{
                            width: 48,
                            height: 48,
                            borderRadius: '50%',
                            backgroundColor: alpha(item.color, 0.1),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 1,
                            color: item.color,
                            fontSize: '1.5rem',
                          }}
                        >
                          {item.icon}
                        </Box>
                        <Typography variant="body2" sx={{ fontWeight: 500 }}>
                          {item.text}
                        </Typography>
                      </Box>
                    </Fade>
                  </Grid>
                ))}
              </Grid>
            </Box>
          </Slide>

          {/* Contact Information */}
          <Slide direction="up" in={showContent} timeout={3000}>
            <Box sx={{ mt: 6, textAlign: 'center' }}>
              <Typography
                variant="h6"
                sx={{
                  fontWeight: 600,
                  mb: 3,
                  color: 'text.primary',
                }}
              >
                Questions About Our Messaging Platform?
              </Typography>
              
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'center',
                  gap: 4,
                  flexWrap: 'wrap',
                  mb: 4,
                }}
              >
                <Tooltip title="Chat with us">
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      color: theme.palette.primary.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.primary.main, 0.2),
                      },
                    }}
                  >
                    <Chat />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Email us">
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.success.main, 0.1),
                      color: theme.palette.success.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.success.main, 0.2),
                      },
                    }}
                  >
                    <Email />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Call us">
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.info.main, 0.1),
                      color: theme.palette.info.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.info.main, 0.2),
                      },
                    }}
                  >
                    <Phone />
                  </IconButton>
                </Tooltip>
                
                <Tooltip title="Video call">
                  <IconButton
                    sx={{
                      backgroundColor: alpha(theme.palette.warning.main, 0.1),
                      color: theme.palette.warning.main,
                      '&:hover': {
                        backgroundColor: alpha(theme.palette.warning.main, 0.2),
                      },
                    }}
                  >
                    <VideoCall />
                  </IconButton>
                </Tooltip>
              </Box>
              
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ fontSize: '0.875rem' }}
              >
                © 2024 HomeService Platform. All rights reserved.
              </Typography>
            </Box>
          </Slide>
        </Box>
      </Fade>
    </Box>
  )
}
