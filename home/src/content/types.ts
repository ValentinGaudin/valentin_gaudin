export type LocaleCode = 'fr' | 'en';

export interface SiteMeta {
  readonly locale: LocaleCode;
  readonly title: string;
  readonly description: string;
  readonly canonicalUrl: string;
  readonly authorName: string;
}

export interface LanguageSwitch {
  readonly activeLabel: string;
  readonly alternateLabel: string;
  readonly alternateHref: string | null;
}

export interface HeaderContent {
  readonly wordmark: string;
  readonly wordmarkHref: string;
  readonly languages: LanguageSwitch;
}

export type NavigationIconName =
  | 'maison'
  | 'epingle'
  | 'grille'
  | 'couches'
  | 'enveloppe';

export interface NavigationItem {
  readonly sectionId: string;
  readonly label: string;
  readonly title: string;
  readonly icon: NavigationIconName;
}

export type SocialIconName = 'github' | 'linkedin';

export interface SocialLink {
  readonly label: string;
  readonly href: string;
  readonly icon: SocialIconName;
}

export interface NavigationContent {
  readonly ariaLabel: string;
  readonly items: readonly NavigationItem[];
  readonly socialLinks: readonly SocialLink[];
}

export interface HeroContent {
  readonly sectionId: string;
  readonly availability: string;
  readonly headlineLines: readonly string[];
  readonly subline: string;
  readonly scrollHint: string;
  readonly year: string;
}

export interface NumberedStep {
  readonly number: string;
  readonly text: string;
}

export interface ActionLink {
  readonly label: string;
  readonly href: string;
  readonly opensInNewTab: boolean;
}

export interface ProjectContent {
  readonly sectionId: string;
  readonly sectionNumber: string;
  readonly title: string;
  readonly domainLabel: string;
  readonly subtitle: string;
  readonly description: string;
  readonly steps: readonly NumberedStep[];
  readonly primaryAction: ActionLink;
  readonly secondaryAction: ActionLink;
  readonly status: string;
  readonly previewCaptionLines: readonly string[];
}

export type PhoneMockupKind = 'generateur-strava' | 'cartes-vides' | 'liste-vide';

export interface MockupStat {
  readonly label: string;
  readonly value: string;
}

export interface StravaMockupContent {
  readonly statusTime: string;
  readonly appName: string;
  readonly sourceTag: string;
  readonly stats: readonly MockupStat[];
  readonly actionLabel: string;
}

export interface PlaceholderMockupContent {
  readonly statusTime: string;
  readonly actionLabel: string;
}

export interface Experiment {
  readonly number: string;
  readonly title: string;
  readonly description: string;
  readonly status: string;
  readonly mockup: PhoneMockupKind;
  readonly isPlaceholder: boolean;
}

export interface LabContent {
  readonly sectionId: string;
  readonly sectionNumber: string;
  readonly title: string;
  readonly intro: string;
  readonly experiments: readonly Experiment[];
  readonly swipeHint: string;
  readonly slideAriaLabelPrefix: string;
  readonly stravaMockup: StravaMockupContent;
  readonly placeholderMockup: PlaceholderMockupContent;
}

export interface StackGroup {
  readonly number: string;
  readonly title: string;
  readonly technologies: readonly string[];
}

export interface StackContent {
  readonly sectionId: string;
  readonly sectionNumber: string;
  readonly title: string;
  readonly intro: string;
  readonly groups: readonly StackGroup[];
  readonly canvasCaption: string;
}

export interface ContactContent {
  readonly sectionId: string;
  readonly sectionNumber: string;
  readonly title: string;
  readonly intro: string;
  readonly emailAddress: string;
  readonly links: readonly ActionLink[];
  readonly signature: string;
}

export interface SiteContent {
  readonly meta: SiteMeta;
  readonly header: HeaderContent;
  readonly navigation: NavigationContent;
  readonly hero: HeroContent;
  readonly project: ProjectContent;
  readonly lab: LabContent;
  readonly stack: StackContent;
  readonly contact: ContactContent;
}
