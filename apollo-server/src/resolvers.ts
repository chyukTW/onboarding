import client from './client';
import pubsub from './pubsub';

const resolvers = {
  Query: {
    getTasks: () => client.task.findMany(),
    getTask: (_: any, { id }: any) => {
      return client.task.findUnique({where: {
        id
      }});
    }
  },
  Mutation: {
    addTask: async (_: any, { text }: any) => {
      try {
        await client.task.create({
          data: {
            text
          }
        })
  
        return {
          ok: true,
        }
      } catch(e) {
        return {
          ok: false,
          error: e
        }
      }
    },
    deleteTask: async (_: any, { id }: any) => {
      try{
        const task = await client.task.findUnique({where: {id}});
  
        if(!task){
          return {
            ok: false,
            error: 'No Task'
          }
        }
  
        await client.task.delete({ where: {id}});
  
        return {
          ok: true
        }
      }catch(e){
        return {
          ok: false,
          error: e
        }
      }
    },
    updateTask: async (_: any, { id, text }: any) => {
      try{
        const task = await client.task.findUnique({where: {id}});

        if(!task){
          return {
            ok: false,
            error: 'No Task'
          }
        }

        await client.task.update({ 
          where: { id },
          data: {
            text
          }
        });

        return {
          ok: true
        }
      } catch(e) {
        return {
          ok: false,
          error: e
        }
      }
    },
  },
  Subscription: {
    randomWord: {
      subscribe: () => pubsub.asyncIterator("randomWord"),
    },
  },
};

export default resolvers;