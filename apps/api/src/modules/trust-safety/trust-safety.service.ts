import { Injectable } from '@nestjs/common';
import { TrustSafetyEvaluationSchema } from '../../../../../packages/validators/src/index';

@Injectable()
export class TrustSafetyService {
  async evaluateProvider(input: unknown) {
    const parsed = TrustSafetyEvaluationSchema.parse(input);
    const documentScore = Math.min(60, parsed.verifiedDocuments * 15);
    const incidentPenalty = parsed.incidentCount * 12;
    const womenSafeBonus = parsed.womenSafeCertified ? 15 : 0;
    const score = Math.max(0, Math.min(100, 35 + documentScore + womenSafeBonus - incidentPenalty));
    const badges = ['verified_reviews'];

    if (parsed.verifiedDocuments >= 3) badges.push('verified_provider');
    if (parsed.womenSafeCertified) badges.push('women_safe');
    if (parsed.incidentCount === 0) badges.push('low_incident_history');

    return {
      score,
      riskLevel: score >= 80 ? 'low' : score >= 55 ? 'medium' : 'high',
      badges,
      moderationRequired: score < 55,
    };
  }
}
