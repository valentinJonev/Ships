using System;
using System.Collections.Generic;
using System.Web.Http;
using System.Web.Http.Dependencies;
using Microsoft.Practices.Unity;
using Ships.Auth.Core;
using Ships.Business.Context;
using Ships.Business.Services;
using Ships.WebApi.Controllers;

namespace Ships.WebApi
{
    public class ServiceResolver : IDependencyResolver
    {
        public ServiceResolver()
            : this(Initialize()) 
        {
        }

        public ServiceResolver(IUnityContainer container)
        {
            if (container == null)
            {
                throw new ArgumentNullException("container");
            }

            this.Container = container;
        }

        public IUnityContainer Container { get; private set; }

        #region IDependencyResolver members

        public object GetService(Type serviceType)
        {
            try
            {
                return Container.Resolve(serviceType);
            }
            catch (ResolutionFailedException)
            {
                return null;
            }
        }

        public IEnumerable<object> GetServices(Type serviceType)
        {
            try
            {
                return Container.ResolveAll(serviceType);
            }
            catch (ResolutionFailedException)
            {
                return new List<object>();
            }
        }

        public IDependencyScope BeginScope()
        {
            var child = Container.CreateChildContainer();
            return new ServiceResolver(child);
        }

        public void Dispose()
        {
            Container.Dispose();
        }

        #endregion

        private static IUnityContainer Initialize()
        {
            var container = new UnityContainer();

            container.RegisterType<ShipsContext>(new InjectionFactory(c => new ShipsContext()));

            container.RegisterType<GameService>(new HierarchicalLifetimeManager());
            container.RegisterType<GameValidationService>(new HierarchicalLifetimeManager());
            container.RegisterType<ShipService>(new HierarchicalLifetimeManager());
            container.RegisterType<ShipValidationService>(new HierarchicalLifetimeManager());
            container.RegisterType<ShotService>(new HierarchicalLifetimeManager());
            container.RegisterType<ShotValidationService>(new HierarchicalLifetimeManager());
            
            container.RegisterType<GameController>(new HierarchicalLifetimeManager());
            container.RegisterType<ShipController>(new HierarchicalLifetimeManager());
            container.RegisterType<ShotController>(new HierarchicalLifetimeManager());

            return container;
        }
    }
}