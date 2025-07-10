
import {
  performanceOptions,
  taskTargetOptions,
  effortRatioOptions,
  gitActivityOptions,
  mergeRatioOptions,
  positiveAttitudeOptions,
  teamManagementOptions,
  onTimeCompletionOptions,
  storyPointAccuracyOptions,
  cvCountOptions,
  recruitmentCostOptions
} from '@/components/kpi/form/kpiFormOptions';

export const getPerformanceLabel = (value: number | string): string => {
  const option = performanceOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getTaskTargetLabel = (value: number | string): string => {
  const option = taskTargetOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getEffortRatioLabel = (value: number | string): string => {
  const option = effortRatioOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getGitActivityLabel = (value: number | string): string => {
  const option = gitActivityOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getMergeRatioLabel = (value: number | string): string => {
  const option = mergeRatioOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getPositiveAttitudeLabel = (value: number | string): string => {
  const option = positiveAttitudeOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getTeamManagementLabel = (value: number | string): string => {
  const option = teamManagementOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getOnTimeCompletionLabel = (value: number | string): string => {
  const option = onTimeCompletionOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getStoryPointAccuracyLabel = (value: number | string): string => {
  const option = storyPointAccuracyOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getCvCountLabel = (value: number | string): string => {
  const option = cvCountOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};

export const getRecruitmentCostLabel = (value: number | string): string => {
  const option = recruitmentCostOptions.find(opt => opt.value === String(value));
  return option ? option.label : String(value);
};
