import { useQuery, type UseQueryResult } from "@tanstack/react-query";
import {
  fetchContentBlocks,
  fetchFaqs,
  fetchFrameFinishes,
  fetchProjectBySlug,
  fetchProjects,
  fetchServices,
  fetchSiteSettings,
  fetchSizeOptions,
  fetchTestimonials,
} from "./queries";
import type {
  ContentBlock,
  Faq,
  FrameFinish,
  Project,
  Service,
  SiteSettings,
  SizeOption,
  Testimonial,
} from "./types";

export const contentKeys = {
  settings: ["site-settings"] as const,
  blocks: ["content-blocks"] as const,
  projects: ["projects"] as const,
  project: (slug: string) => ["project", slug] as const,
  services: ["services"] as const,
  frameFinishes: ["frame-finishes"] as const,
  sizeOptions: ["size-options"] as const,
  testimonials: ["testimonials"] as const,
  faqs: ["faqs"] as const,
};

// Content changes rarely and is edited by one small team — cache hard.
const CONTENT_STALE_TIME = 10 * 60 * 1000;

export const useSiteSettings = (): UseQueryResult<SiteSettings> =>
  useQuery({ queryKey: contentKeys.settings, queryFn: fetchSiteSettings, staleTime: CONTENT_STALE_TIME });

export const useContentBlocks = (): UseQueryResult<Record<string, ContentBlock>> =>
  useQuery({ queryKey: contentKeys.blocks, queryFn: fetchContentBlocks, staleTime: CONTENT_STALE_TIME });

export const useProjects = (): UseQueryResult<Project[]> =>
  useQuery({ queryKey: contentKeys.projects, queryFn: fetchProjects, staleTime: CONTENT_STALE_TIME });

export const useProject = (slug: string | undefined): UseQueryResult<Project | null> =>
  useQuery({
    queryKey: contentKeys.project(slug ?? ""),
    queryFn: () => fetchProjectBySlug(slug as string),
    enabled: Boolean(slug),
    staleTime: CONTENT_STALE_TIME,
  });

export const useServices = (): UseQueryResult<Service[]> =>
  useQuery({ queryKey: contentKeys.services, queryFn: fetchServices, staleTime: CONTENT_STALE_TIME });

export const useFrameFinishes = (): UseQueryResult<FrameFinish[]> =>
  useQuery({ queryKey: contentKeys.frameFinishes, queryFn: fetchFrameFinishes, staleTime: CONTENT_STALE_TIME });

export const useSizeOptions = (): UseQueryResult<SizeOption[]> =>
  useQuery({ queryKey: contentKeys.sizeOptions, queryFn: fetchSizeOptions, staleTime: CONTENT_STALE_TIME });

export const useTestimonials = (): UseQueryResult<Testimonial[]> =>
  useQuery({ queryKey: contentKeys.testimonials, queryFn: fetchTestimonials, staleTime: CONTENT_STALE_TIME });

export const useFaqs = (): UseQueryResult<Faq[]> =>
  useQuery({ queryKey: contentKeys.faqs, queryFn: fetchFaqs, staleTime: CONTENT_STALE_TIME });
