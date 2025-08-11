import { createServer, Model, Factory, belongsTo, hasMany } from 'miragejs';
import { users, reports, wards, categories } from './mockData.js';

export function makeServer({ environment = 'development' } = {}) {
  return createServer({
    environment,

    models: {
      user: Model,
      report: Model.extend({
        user: belongsTo(),
      }),
    },

    factories: {
      user: Factory.extend({
        name: 'Test User',
        email: 'test@example.com',
        role: 'resident',
      }),
    },

    seeds(server) {
      users.forEach(user => server.create('user', user));
      reports.forEach(report => server.create('report', report));
    },

    routes() {
      this.namespace = 'api';
      this.timing = 400; // Simulate network delay

      // Auth routes
      this.post('/auth/login', (schema, request) => {
        const { email, password } = JSON.parse(request.requestBody);
        const user = schema.users.findBy({ email, password });
        
        if (user) {
          const token = btoa(JSON.stringify({ userId: user.id, role: user.attrs.role }));
          return {
            token,
            user: user.attrs
          };
        } else {
          return new Response(401, {}, { error: 'Invalid credentials' });
        }
      });

      this.post('/auth/register', (schema, request) => {
        const userData = JSON.parse(request.requestBody);
        const newUser = {
          ...userData,
          id: Date.now(),
          role: 'resident',
          avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop'
        };
        
        const user = schema.create('user', newUser);
        const token = btoa(JSON.stringify({ userId: user.id, role: user.attrs.role }));
        
        return {
          token,
          user: user.attrs
        };
      });

      this.get('/users/me', (schema, request) => {
        const token = request.requestHeaders.Authorization?.replace('Bearer ', '');
        if (token) {
          try {
            const decoded = JSON.parse(atob(token));
            const user = schema.users.find(decoded.userId);
            return user ? user.attrs : new Response(401, {}, { error: 'Invalid token' });
          } catch {
            return new Response(401, {}, { error: 'Invalid token' });
          }
        }
        return new Response(401, {}, { error: 'No token provided' });
      });

      // Reports routes
      this.get('/reports', (schema, request) => {
        const { page = 1, category, status, search, ward } = request.queryParams;
        let reports = schema.reports.all().models;

        if (category) {
          reports = reports.filter(r => r.attrs.category === category);
        }
        if (status) {
          reports = reports.filter(r => r.attrs.status === status);
        }
        if (search) {
          reports = reports.filter(r => 
            r.attrs.title.toLowerCase().includes(search.toLowerCase()) ||
            r.attrs.description.toLowerCase().includes(search.toLowerCase())
          );
        }
        if (ward) {
          reports = reports.filter(r => r.attrs.ward === ward);
        }

        // Sort by votes descending
        reports.sort((a, b) => b.attrs.votes - a.attrs.votes);

        const pageSize = 10;
        const start = (page - 1) * pageSize;
        const paginatedReports = reports.slice(start, start + pageSize);

        return {
          reports: paginatedReports.map(r => r.attrs),
          total: reports.length,
          page: parseInt(page),
          totalPages: Math.ceil(reports.length / pageSize)
        };
      });

      this.get('/reports/:id', (schema, request) => {
        const report = schema.reports.find(request.params.id);
        return report ? report.attrs : new Response(404, {}, { error: 'Report not found' });
      });

      this.post('/reports', (schema, request) => {
        const reportData = JSON.parse(request.requestBody);
        const newReport = {
          ...reportData,
          id: Date.now(),
          votes: 0,
          status: 'pending',
          createdAt: new Date().toISOString()
        };
        
        const report = schema.create('report', newReport);
        return report.attrs;
      });

      this.post('/reports/:id/vote', (schema, request) => {
        const report = schema.reports.find(request.params.id);
        if (report) {
          report.update({ votes: report.attrs.votes + 1 });
          return { voteCount: report.attrs.votes, voted: true };
        }
        return new Response(404, {}, { error: 'Report not found' });
      });

      this.patch('/reports/:id/status', (schema, request) => {
        const { status } = JSON.parse(request.requestBody);
        const report = schema.reports.find(request.params.id);
        if (report) {
          report.update({ status });
          return report.attrs;
        }
        return new Response(404, {}, { error: 'Report not found' });
      });

      // Stats route
      this.get('/stats', (schema) => {
        const reports = schema.reports.all().models;
        return {
          total: reports.length,
          pending: reports.filter(r => r.attrs.status === 'pending').length,
          inProgress: reports.filter(r => r.attrs.status === 'in-progress').length,
          resolved: reports.filter(r => r.attrs.status === 'resolved').length
        };
      });

      // Static data routes
      this.get('/wards', () => ({ wards }));
      this.get('/categories', () => ({ categories }));
    },
  });
}