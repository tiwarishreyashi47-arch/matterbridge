import { getAllMatters } from "@/lib/data/matter-service";
import { getExternalCounselAccess } from "@/lib/data/access-service";
import type { Counsel, CounselEngagement, MatterBundle } from "@/lib/types/matter";

export interface CounselPortfolioMatter {
  matterId: string;
  matterTitle: string;
  matterType: string;
  engagement: CounselEngagement;
  workstreams: string[];
  hasExternalCounselAccess: boolean;
}

export interface CounselPortfolioGroup {
  counsel: Counsel;
  matters: CounselPortfolioMatter[];
  topics: string[];
}

function portfolioText(matterData: MatterBundle, engagement: CounselEngagement) {
  return [
    matterData.matter.matter_title,
    matterData.matter_type?.matter_type_name,
    engagement.engagement_type,
    engagement.engagement_description,
    ...matterData.workstreams.map((workstream) => workstream.workstream_name),
  ]
    .filter(Boolean)
    .join(" ")
    .toLowerCase();
}

function topicsFor(matterData: MatterBundle, engagement: CounselEngagement) {
  const text = portfolioText(matterData, engagement);
  const topicRules = [
    ["Recovery", ["recover", "recovery"]],
    ["Security", ["security", "secured"]],
    ["Enforcement", ["enforcement"]],
    ["Employment", ["employment", "employee", "workplace", "hr"]],
    ["Regulatory", ["regulatory", "compliance"]],
    ["Contract", ["contract", "facility"]],
  ] as const;

  return topicRules
    .filter(([, terms]) => terms.some((term) => text.includes(term)))
    .map(([topic]) => topic);
}

export function getCounselPortfolio(): CounselPortfolioGroup[] {
  const groups = new Map<string, CounselPortfolioGroup>();

  for (const matterData of getAllMatters()) {
    for (const engagement of matterData.counsel_engagements ?? []) {
      const counsel = engagement.counsel;

      if (!counsel) {
        continue;
      }

      const key = counsel.counsel_id;
      const existing = groups.get(key) ?? {
        counsel,
        matters: [],
        topics: [],
      };
      const matter = {
        matterId: matterData.matter.matter_id,
        matterTitle: matterData.matter.matter_title,
        matterType: matterData.matter_type?.matter_type_name ?? "Not recorded",
        engagement,
        workstreams: matterData.workstreams.map(
          (workstream) => workstream.workstream_name
        ),
        hasExternalCounselAccess: Boolean(getExternalCounselAccess(matterData)),
      };

      existing.matters.push(matter);
      existing.topics = Array.from(
        new Set([...existing.topics, ...topicsFor(matterData, engagement)])
      );
      groups.set(key, existing);
    }
  }

  return Array.from(groups.values());
}
