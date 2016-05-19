using System;

namespace Ships.Business.Services
{
    public class ShipsAlreadyAddedException : InvalidOperationException
    {
    }

    public class ShotAlreadyExistsException : InvalidOperationException
    {
    }
}
