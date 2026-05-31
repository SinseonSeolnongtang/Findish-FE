import { defineConfig } from 'orval';

export default defineConfig({
  findish: {
    input: {
      target: './swagger.json',
    },
    output: {
      mode: 'tags-split',
      target: './src/api/generated',
      client: 'react-query',
      httpClient: 'axios',
      clean: true,
      override: {
        mutator: {
          path: './src/lib/axiosInstance.ts',
          name: 'customAxiosMutator',
        },
        query: {
          useQuery: true,
          useMutation: true,
        },
      },
    },
  },
});
