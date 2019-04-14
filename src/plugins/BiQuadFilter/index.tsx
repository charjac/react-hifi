import { pluginFactory } from '../_lib/plugin-factory';
import { Plugin } from '../Plugin';

interface BiQuadPluginProps {
  value: number;
  freq: number;
  prevFreq?: number;
  nextFreq?: number;
  q?: number;
  type?:
    | 'lowpass'
    | 'highpass'
    | 'bandpass'
    | 'lowshelf'
    | 'highshelf'
    | 'peaking'
    | 'notch'
    | 'allpass';
}

export class BiQuadPlugin implements Plugin<BiQuadPluginProps, BiquadFilterNode> {
  shouldNotUpdate(prevProps: BiQuadPluginProps, nextProps: BiQuadPluginProps) {
    return prevProps.value === nextProps.value && prevProps.q === nextProps.q;
  }

  createNode(
    audioContext: AudioContext,
    { value, freq, nextFreq, prevFreq, type, q }: BiQuadPluginProps,
  ) {
    const filter = new BiquadFilterNode(audioContext);

    filter.frequency.value = freq;
    filter.gain.value = value;

    if (freq && nextFreq && prevFreq) {
      filter.type = type || 'peaking';
      filter.Q.value = q || (2 * freq) / Math.abs(nextFreq - prevFreq);
    } else if (nextFreq && !prevFreq) {
      filter.type = type || 'lowshelf';
    } else if (prevFreq && !nextFreq) {
      filter.type = type || 'highshelf';
    } else {
      filter.type = type || 'peaking';
    }

    return filter;
  }

  updateNode({ gain }: BiquadFilterNode, { value }: BiQuadPluginProps) {
    gain.value = value;
  }
}

export default pluginFactory<BiQuadPluginProps, BiquadFilterNode>(new BiQuadPlugin());
