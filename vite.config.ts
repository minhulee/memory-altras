import { defineConfig } from 'vite';

export default defineConfig({
  optimizeDeps: {
    include: ['@babylonjs/core/Behaviors/Cameras/framingBehavior'],
  },
});
